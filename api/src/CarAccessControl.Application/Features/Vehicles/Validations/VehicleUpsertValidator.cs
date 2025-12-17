using FluentValidation;
using CarAccessControl.Application.Common.Localization;
using CarAccessControl.Application.Features.Vehicles.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Validations;

public class VehicleUpsertValidator : AbstractValidator<VehicleUpsertDto>
{
    public VehicleUpsertValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(2, 100).WithMessage(SharedResource.Validation_Length);

        RuleFor(x => x.PlateNumber)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(8, 15).WithMessage(SharedResource.Validation_Length)
            .Matches(@"^[a-zA-Z0-9\u0600-\u06FF\s-]+$")
            .WithMessage(SharedResource.Validation_PlateInvalid);

        RuleFor(x => x.OwnerId)
            .GreaterThan(0).WithMessage(SharedResource.Validation_GreaterThan);
    }
}