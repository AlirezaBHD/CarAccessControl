using CarAccessControl.Application.Common.Localization;
using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using FluentValidation;

namespace CarAccessControl.Application.Features.VehicleOwners.Validations;

public class VehicleOwnerUpsertValidator : AbstractValidator<VehicleOwnerUpsertDto>
{
    public VehicleOwnerUpsertValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(2, 50).WithMessage(SharedResource.Validation_Length); 

        RuleFor(x => x.Surname)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(2, 50).WithMessage(SharedResource.Validation_Length);

        RuleFor(x => x.NationalCode)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(10).WithMessage(SharedResource.Validation_ExactLength)
            .Matches("^[0-9]*$").WithMessage(SharedResource.Validation_Numeric);
    }
}