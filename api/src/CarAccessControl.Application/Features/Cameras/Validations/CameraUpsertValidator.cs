using FluentValidation;
using CarAccessControl.Application.Common.Localization;
using CarAccessControl.Application.Features.Cameras.Dtos;

namespace CarAccessControl.Application.Features.Cameras.Validations;

public class CameraUpsertValidator : AbstractValidator<CameraUpsertDto>
{
    public CameraUpsertValidator()
    {
        RuleFor(x => x.Ip)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .Length(7, 15).WithMessage(SharedResource.Validation_Length)
            .Matches(@"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
            .WithMessage(SharedResource.Validation_IpInvalid);

        RuleFor(x => x.Url)
            .NotEmpty().WithMessage(SharedResource.Validation_Required)
            .MaximumLength(400).WithMessage(SharedResource.Validation_MaxLength)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage(SharedResource.Validation_UrlInvalid);

        RuleFor(x => x.FrameInterval)
            .GreaterThan(0).WithMessage(SharedResource.Validation_GreaterThan)
            .LessThanOrEqualTo(60).WithMessage(SharedResource.Validation_MaxLength);
    }
}