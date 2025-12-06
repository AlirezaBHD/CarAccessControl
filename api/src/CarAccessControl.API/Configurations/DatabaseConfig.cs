using CarAccessControl.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarAccessControl.API.Configurations;

public static class DatabaseConfig
{
    public static IServiceCollection AddAppDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection"),
                    npgsqlOptions => npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)
                )
                .UseSnakeCaseNamingConvention());

        return services;
    }
}