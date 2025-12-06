using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Vehicles.Specifications;

public class AllVehiclesSpec : BaseSpecification<Vehicle>
{
    public AllVehiclesSpec()
    {
        ApplyOrderByDescending(v => v.CreatedOn);
    }
}