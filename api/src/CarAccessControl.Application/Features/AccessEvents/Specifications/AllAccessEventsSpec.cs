using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.AccessEvents.Specifications;

public class AllAccessEventsSpec : BaseSpecification<AccessEvent>
{
    public AllAccessEventsSpec(): base(ae => ae.Enter != null)
    {
        ApplyNoTracking();
        ApplyPaging(skip: 0, take: 10);
        ApplyOrderByDescending(ae => ae.CreatedOn);
    }
}