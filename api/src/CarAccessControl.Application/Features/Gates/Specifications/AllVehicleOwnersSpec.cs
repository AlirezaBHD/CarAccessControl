using CarAccessControl.Application.Common.Specifications;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Gates.Specifications;

public class AllGatesSpec : BaseSpecification<Gate>
{
    public AllGatesSpec()
    {
        ApplyOrderByDescending(g => g.CreatedOn);
    }
}