using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Dtos;

public class VehicleListDto : IdentifierDto
{
    public required string Name { get; init; }
    
    public required string PlateNumber { get; init; }
    
    public required string OwnerFullName { get; init; }
}