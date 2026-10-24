using Portfolio.Api.Data;
using Portfolio.Api.Services.Portfolio;
using Portfolio.Api.Extensions;
using Portfolio.Api.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.DataProtection;
using Asp.Versioning;

// www.googleapis.com answers 403 over IPv6 on this server, which breaks Google sign-in.
AppContext.SetSwitch("System.Net.DisableIPv6", true);

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile(
    Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
        ".config",
        "developer-portfolio",
        "secrets.json"),
    optional: true,
    reloadOnChange: false);

builder.Host.UseSerilog((context, _, logger) => logger
    .ReadFrom.Configuration(context.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", context.HostingEnvironment.ApplicationName)
    .WriteTo.Console());

builder.WebHost.ConfigureKestrel(options =>
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024);

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
var dataProtection = builder.Services.AddDataProtection()
    .SetApplicationName(builder.Environment.ApplicationName);
var dataProtectionKeysPath = builder.Configuration["DataProtection:KeysPath"];
if (!string.IsNullOrWhiteSpace(dataProtectionKeysPath))
{
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(dataProtectionKeysPath));
}

var databaseConnection =
    builder.Configuration.GetConnectionString("DatabaseConnection");

if (string.IsNullOrWhiteSpace(databaseConnection))
{
    throw new InvalidOperationException(
        "ConnectionStrings:DatabaseConnection is required.");
}

builder.Services.AddDbContext<DataContext>(options =>
    options
        .UseNpgsql(databaseConnection)
        .UseLazyLoadingProxies());

builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    options.HeaderName = "X-XSRF-TOKEN";
});
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new AutoValidateAntiforgeryTokenAttribute());
})
.ConfigureApiBehaviorOptions(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var problem = new ValidationProblemDetails(context.ModelState)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Request validation failed",
            Detail = "One or more fields are invalid.",
            Instance = context.HttpContext.Request.Path
        };
        problem.Extensions["messageKey"] = "api.validationFailed";
        problem.Extensions["correlationId"] = context.HttpContext.TraceIdentifier;
        return new BadRequestObjectResult(problem);
    };
});
builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new QueryStringApiVersionReader("api-version"),
        new HeaderApiVersionReader("X-Api-Version"));
})
.AddMvc()
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV";
    options.SubstituteApiVersionInUrl = true;
});
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("authentication", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.AddPolicy("contact-google", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
    options.AddPolicy("contact-submit", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

var configuration = builder.Configuration;

// JWT Authentication

var secretKeyConfig = configuration["AuthSettings:SecretKey"];
if (string.IsNullOrWhiteSpace(secretKeyConfig))
{
    throw new InvalidOperationException("AuthSettings:SecretKey is required.");
}
var key = Encoding.ASCII.GetBytes(secretKeyConfig);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = configuration["AuthSettings:Issuer"],
        ValidateAudience = true,
        ValidAudience = configuration["AuthSettings:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1),
    };
    x.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("token"))
            {
                context.Token = context.Request.Cookies["token"];
            }
            return Task.CompletedTask;
        },
        OnTokenValidated = async context =>
        {
            var idValue = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            var sidValue = context.Principal?.FindFirstValue(ClaimTypes.Sid);
            if (!int.TryParse(idValue, out var userId) || !Guid.TryParse(sidValue, out var securityStamp))
            {
                context.Fail("Invalid session claims.");
                return;
            }

            var dataContext = context.HttpContext.RequestServices.GetRequiredService<DataContext>();
            var user = await dataContext.Users
                .AsNoTracking()
                .Include(item => item.Roles)
                .SingleOrDefaultAsync(item => item.Id == userId);
            if (user is null || user.IsLocked || user.SecurityStamp != securityStamp)
            {
                context.Fail("Session is no longer valid.");
                return;
            }

            var tokenRoles = context.Principal?.FindAll(ClaimTypes.Role)
                .Select(claim => claim.Value)
                .OrderBy(role => role)
                .ToArray() ?? [];
            var currentRoles = user.Roles
                .Where(role => role.IsActive)
                .Select(role => role.Name)
                .OrderBy(role => role)
                .ToArray();
            if (currentRoles.Length == 0)
            {
                context.Fail("User has no active role.");
                return;
            }
            if (!tokenRoles.SequenceEqual(currentRoles, StringComparer.OrdinalIgnoreCase))
            {
                context.Fail("User permissions changed.");
            }
        }
    };
});


builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddPortfolioInfrastructure();

var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    });
});

var app = builder.Build();
app.UseForwardedHeaders();

// Configure the HTTP request pipeline.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

// Custom Middleware for Exception Handling
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseSerilogRequestLogging();

app.UseResponseCompression();

app.UseRouting();

app.UseCors();
app.UseRateLimiter();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

using (var migrationScope = app.Services.CreateScope())
{
    var dataContext = migrationScope.ServiceProvider.GetRequiredService<DataContext>();
    if (dataContext.Database.IsRelational())
    {
        await EnsureVisitorContactColumnsAsync(dataContext, app.Logger);
        await PortfolioContentService.SeedPublishedCatalogAsync(dataContext);
    }
}

app.MapControllers();
app.Map("/api/{**path}", () => Results.NotFound(new
{
    message = "Ruta API solicitată nu există.",
    messageKey = "api.routeNotFound"
}));
app.MapHealthChecks("/health", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteHealthResponse
}).AllowAnonymous();
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = registration => registration.Tags.Contains("ready"),
    ResponseWriter = WriteHealthResponse
}).AllowAnonymous();
app.Run();

static async Task EnsureVisitorContactColumnsAsync(DataContext dataContext, Microsoft.Extensions.Logging.ILogger logger)
{
    var statements = new[]
    {
        """ALTER TABLE "ContactMessages" ADD COLUMN IF NOT EXISTS "SenderName" character varying(120) NOT NULL DEFAULT ''""",
        """ALTER TABLE "ContactMessages" ADD COLUMN IF NOT EXISTS "SenderEmail" character varying(200) NOT NULL DEFAULT ''""",
        """ALTER TABLE "ContactMessages" ALTER COLUMN "UserId" DROP NOT NULL""",
        """ALTER TABLE "ContactMessages" ALTER COLUMN "ConsentId" DROP NOT NULL"""
    };

    try
    {
        foreach (var statement in statements)
            await dataContext.Database.ExecuteSqlRawAsync(statement);
    }
    catch (Exception exception)
    {
        logger.LogError(exception, "Contact message columns could not be updated");
    }
}

static Task WriteHealthResponse(HttpContext context, Microsoft.Extensions.Diagnostics.HealthChecks.HealthReport report)
{
    context.Response.ContentType = "application/json";
    return context.Response.WriteAsync(JsonSerializer.Serialize(new
    {
        status = report.Status.ToString(),
        duration = report.TotalDuration,
        checks = report.Entries.Select(entry => new
        {
            name = entry.Key,
            status = entry.Value.Status.ToString(),
            description = entry.Value.Description,
            duration = entry.Value.Duration,
            data = entry.Value.Data
        })
    }));
}

public partial class Program;
