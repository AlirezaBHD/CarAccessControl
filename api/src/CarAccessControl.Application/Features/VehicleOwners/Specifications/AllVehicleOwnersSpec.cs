using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.VehicleOwners.Specifications;

public class AllVehicleOwnersSpec : BaseSpecification<VehicleOwner>
{
    public AllVehicleOwnersSpec()
    {
        ApplyOrderByDescending(vo => vo.CreatedOn);
    }
}