using FluentValidation;
using CarAccessControl.Application.Common.Localization;
using CarAccessControl.Application.Features.AccessEvents.Dtos;

namespace CarAccessControl.Application.Features.AccessEvents.Validations;

public class CompleteEventValidator : AbstractValidator<CompleteEventDto>
{
    public CompleteEventValidator()
    {
        RuleFor(x => x.VehicleName)
            .MaximumLength(100).WithMessage(SharedResource.Validation_MaxLength)
            .When(x => !string.IsNullOrEmpty(x.VehicleName));

        RuleFor(x => x.OwnerFirstName)
            .Length(2, 50).WithMessage(SharedResource.Validation_Length)
            .When(x => !string.IsNullOrEmpty(x.OwnerFirstName));

        RuleFor(x => x.OwnerSureName)
            .Length(2, 50).WithMessage(SharedResource.Validation_Length)
            .When(x => !string.IsNullOrEmpty(x.OwnerSureName));
    }
}