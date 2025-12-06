using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using FluentValidation;

namespace CarAccessControl.Application.Features.VehicleOwners.Validations;

public class CreateVehicleOwnerValidation : AbstractValidator<VehicleOwnerUpsertDto>
{
    public CreateVehicleOwnerValidation()
    {
        RuleFor(x => x.FirstName)
            .Length(2, 50).WithMessage("نام باید بین ۲ تا ۵۰ کاراکتر باشد")
            .When(x => !string.IsNullOrEmpty(x.FirstName));

        RuleFor(x => x.SureName)
            .NotEmpty().WithMessage("نام خانوادگی اجباری است")
            .Length(2, 50).WithMessage("نام خانوادگی باید بین ۲ تا ۵۰ کاراکتر باشد");

        RuleFor(x => x.NationalCode)
            .Length(10, 10).WithMessage("کد ملی باید دقیقاً ۱۰ کاراکتر باشد")
            .Matches("^[0-9]*$").WithMessage("کد ملی باید فقط شامل اعداد باشد")
            .When(x => !string.IsNullOrEmpty(x.NationalCode));
    }
}