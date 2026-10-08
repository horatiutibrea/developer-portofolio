using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Portfolio.Api.Data
{
    public sealed class DesignTimeDataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            var basePath = Directory.GetCurrentDirectory();
            var projectPath = Path.Combine(basePath, "src", "Portfolio.Api");
            if (!File.Exists(Path.Combine(basePath, "appsettings.json"))
                && File.Exists(Path.Combine(projectPath, "appsettings.json")))
            {
                basePath = projectPath;
            }

            var environment =
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
                ?? Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT")
                ?? "Development";

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .AddUserSecrets<DesignTimeDataContextFactory>(optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetConnectionString("DatabaseConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "ConnectionStrings:DatabaseConnection lipsește din appsettings.");
            }

            var options = new DbContextOptionsBuilder<DataContext>()
                .UseNpgsql(connectionString)
                .UseLazyLoadingProxies()
                .Options;

            return new DataContext(options);
        }
    }
}
