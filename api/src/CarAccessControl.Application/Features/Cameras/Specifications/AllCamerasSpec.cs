using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Cameras.Specifications;

public class AllCamerasSpec : BaseSpecification<Camera>
{
    public AllCamerasSpec()
    {
        ApplyOrderByDescending(c => c.CreatedOn);
    }
}