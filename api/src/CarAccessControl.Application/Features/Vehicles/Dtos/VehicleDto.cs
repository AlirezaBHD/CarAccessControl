using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Dtos;

public class VehicleDto : IdentifierDto
{
    public required string Name { get; set; }
    public int OwnerId { get; set; }
    public required string OwnerFirstName { get; set; }
    public required string OwnerSureName { get; set; }
}
