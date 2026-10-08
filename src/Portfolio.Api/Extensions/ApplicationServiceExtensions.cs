using Portfolio.Api.Configuration;
using Portfolio.Api.Services.Authentication;
using Portfolio.Api.Services.Roles;
using Portfolio.Api.Services.Portfolio;
using Portfolio.Api.Services.Users;

namespace Portfolio.Api.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddOptions<AuthSettings>()
                .Bind(config.GetSection("AuthSettings"))
                .Validate(settings => !string.IsNullOrWhiteSpace(settings.SecretKey), "AuthSettings:SecretKey is required.")
                .Validate(settings => settings.SecretKey?.Length >= 32, "AuthSettings:SecretKey must contain at least 32 characters.")
                .Validate(settings => !string.IsNullOrWhiteSpace(settings.GoogleClientId), "AuthSettings:GoogleClientId is required.")
                .Validate(settings => !string.IsNullOrWhiteSpace(settings.Issuer), "AuthSettings:Issuer is required.")
                .Validate(settings => !string.IsNullOrWhiteSpace(settings.Audience), "AuthSettings:Audience is required.")
                .Validate(settings => settings.JwtValidityInHours is > 0 and <= 24, "AuthSettings:JwtValidityInHours must be between 1 and 24.")
                .ValidateOnStart();
            services.AddHttpClient();
            services.AddHttpContextAccessor();

            services.AddScoped<IAuthenticationService, AuthenticationService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRolesService, RolesService>();
            services.AddScoped<PortfolioContentService>();

            return services;
        }
    }
}
