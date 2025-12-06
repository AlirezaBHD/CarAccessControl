using CarAccessControl.API.Utilities;
using CarAccessControl.Application.Features.VehicleOwners.Validations;
using FluentValidation;
using FluentValidation.AspNetCore;
using MicroElements.Swashbuckle.FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace CarAccessControl.API.Configurations;

public static class ControllersConfig
{
    public static IServiceCollection AddAppControllers(this IServiceCollection services)
    {
        services.AddControllers(options =>
        {
            options.ModelValidatorProviders.Clear();
            options.Conventions.Add(new RouteTokenTransformerConvention(new KebabCaseParameterTransformer()));
        });

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<CreateVehicleOwnerValidation>();
        services.AddFluentValidationRulesToSwagger();

        return services;
    }
}