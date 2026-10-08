using Portfolio.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.AspNetCore.DataProtection;
using System.Net;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Services.Authentication;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Portfolio.Api.Tests;

public sealed class ApiSecurityTests : IClassFixture<ApiSecurityFactory>
{
    private readonly HttpClient _client;
    private readonly ApiSecurityFactory _factory;

    public ApiSecurityTests(ApiSecurityFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://localhost")
        });
    }

    [Fact]
    public async Task CsrfEndpointIsAnonymousAndIssuesToken()
    {
        var response = await _client.GetAsync("/api/security/csrf");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("XSRF-TOKEN", response.Headers.GetValues("Set-Cookie").Single());
    }

    [Theory]
    [InlineData("/api/utilizatori")]
    [InlineData("/api/roluri")]
    public async Task AdministrativeEndpointsRejectAnonymousRequests(string path)
    {
        var response = await _client.GetAsync(path);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ChangingSecurityStampInvalidatesExistingSession()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        await context.Database.EnsureCreatedAsync();
        var role = await context.Roles.SingleAsync(item => item.Name == "USER");
        var user = new User
        {
            Email = $"session-{Guid.NewGuid():N}@net.ase.ro",
            FirstName = "Session",
            LastName = "Test",
            SecurityStamp = Guid.NewGuid(),
            UserRoles = [new UserRole { Role = role }]
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        var auth = scope.ServiceProvider.GetRequiredService<IAuthenticationService>();
        var token = auth.GenerateJwtToken(user, [role]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var firstResponse = await _client.GetAsync("/api/auth/session");
        Assert.True(firstResponse.StatusCode == HttpStatusCode.OK,
            $"Status: {firstResponse.StatusCode}; auth: {string.Join(" | ", firstResponse.Headers.WwwAuthenticate)}");
        user.SecurityStamp = Guid.NewGuid();
        await context.SaveChangesAsync();
        Assert.Equal(HttpStatusCode.Unauthorized, (await _client.GetAsync("/api/auth/session")).StatusCode);
    }

}

public sealed class ApiSecurityFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"security-tests-{Guid.NewGuid()}";

    static ApiSecurityFactory()
    {
        // Program reads configuration before the test host can add its own sources.
        Environment.SetEnvironmentVariable(
            "ConnectionStrings__DatabaseConnection",
            "Host=localhost;Port=5432;Database=unused;Username=unused;Password=unused");
        Environment.SetEnvironmentVariable("AuthSettings__SecretKey", new string('x', 64));
        Environment.SetEnvironmentVariable("AuthSettings__GoogleClientId", "test.apps.googleusercontent.com");
        Environment.SetEnvironmentVariable("AuthSettings__JwtValidityInHours", "6");
        Environment.SetEnvironmentVariable("AuthSettings__Issuer", "tests");
        Environment.SetEnvironmentVariable("AuthSettings__Audience", "tests");
        Environment.SetEnvironmentVariable("Database__FailOnPendingMigrations", "false");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DatabaseConnection"] =
    "Host=localhost;Port=5432;Database=unused;Username=unused;Password=unused",
                ["AuthSettings:SecretKey"] = new string('x', 64),
                ["AuthSettings:GoogleClientId"] = "test.apps.googleusercontent.com",
                ["AuthSettings:JwtValidityInHours"] = "6",
                ["AuthSettings:Issuer"] = "tests",
                ["AuthSettings:Audience"] = "tests"
            });
        });
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<DataContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<DataContext>>();
            services.AddDbContext<DataContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters.IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(new string('x', 64)));
                options.TokenValidationParameters.ValidIssuer = "tests";
                options.TokenValidationParameters.ValidAudience = "tests";
            });
            services.AddDataProtection().UseEphemeralDataProtectionProvider();
        });
    }
}
