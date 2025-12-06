using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.AccessEvents.Specifications;

public class ReportSpec : BaseSpecification<AccessEvent>
{
    public ReportSpec(DateTime fromDate, DateTime toDate, int? ownerId, int? vehicleId)
        : base(e => e.CreatedOn >= fromDate.ToUniversalTime() && e.CreatedOn <= toDate.ToUniversalTime())
    {
        if (ownerId.HasValue)
        {
            AddCriteria(e => e.OwnerId == ownerId.Value);
        }

        if (vehicleId.HasValue)
        {
            AddCriteria(e => e.VehicleId == vehicleId.Value);
        }

        ApplyNoTracking();
        ApplyPaging(skip: 0, take: 10);
        ApplyOrderByDescending(ae => ae.CreatedOn);
    }
}