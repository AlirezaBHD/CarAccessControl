using System.Reflection;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Services;
using CarAccessControl.Application.Features.Cameras.Interfaces;
using CarAccessControl.Application.Features.Cameras.Services;
using CarAccessControl.Application.Features.Gates.Interfaces;
using CarAccessControl.Application.Features.Gates.Services;
using CarAccessControl.Application.Features.VehicleOwners.Interfaces;
using CarAccessControl.Application.Features.VehicleOwners.Services;
using CarAccessControl.Application.Features.Vehicles.Interfaces;
using CarAccessControl.Application.Features.Vehicles.Services;
using Microsoft.Extensions.DependencyInjection;

namespace CarAccessControl.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IVehicleOwnerService, VehicleOwnerService>();
        services.AddScoped<ICameraService, CameraService>();
        services.AddScoped<IGateService, GateService>();
        services.AddScoped<IVehicleService, VehicleService>();
        services.AddScoped<IAccessEventService, AccessEventService>();
        services.AddScoped<IAccessEventNotificationService, AccessEventNotificationService>();

        services.AddSingleton<ILicensePlateService, LicensePlateService>();

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddSignalR();

        return services;
    }
}