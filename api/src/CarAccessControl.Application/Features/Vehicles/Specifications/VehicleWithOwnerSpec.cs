using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Vehicles.Specifications;

public class VehicleWithOwnerSpec : BaseSpecification<Vehicle>
{
    public VehicleWithOwnerSpec(string plateNumber)
        : base(v => v.PlateNumber == plateNumber)
    {
        AddInclude(v => v.Owner);
    }
}