using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Cameras.Specifications;

public class ActiveGateCamerasSpec : BaseSpecification<Camera>
{
    public ActiveGateCamerasSpec() : base(c => c.Gate!.IsActive)
    {
        AddInclude(c => c.Gate!);
    }
}