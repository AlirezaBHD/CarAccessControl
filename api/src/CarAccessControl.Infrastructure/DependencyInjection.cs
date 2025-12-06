using CarAccessControl.Application.Common.Interfaces;
using CarAccessControl.Application.Common.Interfaces.Streaming;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.BackgroundJobs;
using CarAccessControl.Infrastructure.Repositories;
using CarAccessControl.Infrastructure.Services;
using CarAccessControl.Infrastructure.Services.Streaming;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ILicensePlateRecognizer = CarAccessControl.Domain.Interfaces.ILicensePlateRecognizer;

namespace CarAccessControl.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IVehicleOwnerRepository, VehicleOwnerRepository>();
        services.AddScoped<ICameraRepository, CameraRepository>();
        services.AddScoped<IGateRepository, GateRepository>();
        services.AddScoped<IVehicleRepository, VehicleRepository>();
        services.AddScoped<IAccessEventRepository, AccessEventRepository>();

        services.AddScoped<IExcelReportService, ExcelReportService>();
        services.AddSingleton<IStorageService, LocalStorageService>();
        services.AddSingleton<ICameraStreamFactory, CameraStreamFactory>();

        services.AddHttpClient<ILicensePlateRecognizer, HttpLicensePlateRecognizerService>(client =>
        {
            var url = configuration.GetValue<string>("ModelUrl") ?? "http://localhost:8000";
            client.BaseAddress = new Uri(url);
        });

        // services.AddHostedService<CameraManagerWorker>();

        return services;
    }
}