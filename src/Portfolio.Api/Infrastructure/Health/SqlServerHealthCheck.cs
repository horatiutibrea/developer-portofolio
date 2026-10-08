using Portfolio.Api.Data;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Portfolio.Api.Infrastructure.Health
{
    public sealed class SqlServerHealthCheck(DataContext dataContext) : IHealthCheck
    {
        private readonly DataContext _dataContext = dataContext;

        public async Task<HealthCheckResult> CheckHealthAsync(
            HealthCheckContext context,
            CancellationToken cancellationToken = default)
        {
            return await _dataContext.Database.CanConnectAsync(cancellationToken)
                ? HealthCheckResult.Healthy("SQL Server is reachable.")
                : HealthCheckResult.Unhealthy("SQL Server is not reachable.");
        }
    }
}
