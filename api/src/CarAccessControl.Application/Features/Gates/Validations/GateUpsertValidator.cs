using FluentValidation;
using CarAccessControl.Application.Common.Localization;
using CarAccessControl.Application.Features.Gates.Dtos;

namespace CarAccessControl.Application.Features.Gates.Validations;

public class GateUpsertValidator : AbstractValidator<GateUpsertDto>
{
    public GateUpsertValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(2, 200).WithMessage(SharedResource.Validation_Length);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(2, 200).WithMessage(SharedResource.Validation_Length);

        RuleFor(x => x.CameraId)
            .GreaterThan(0).WithMessage(SharedResource.Validation_GreaterThan);
    }
}