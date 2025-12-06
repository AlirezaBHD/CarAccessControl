using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.VehicleOwners.Dtos;

public class VehicleOwnerListDto : IdentifierDto
{
    public required string FirstName { get; init; }
    
    public required string SureName { get; init; }
    
    public required string NationalCode { get; init; }
    
    public int VehiclesCount { get; init; }
}