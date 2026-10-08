using Portfolio.Api.Infrastructure.Health;

namespace Portfolio.Api.Extensions
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddPortfolioInfrastructure(
            this IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddCheck<SqlServerHealthCheck>("sql-server", tags: ["ready"]);

            return services;
        }
    }
}
