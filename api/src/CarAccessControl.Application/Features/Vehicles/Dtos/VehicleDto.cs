using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Dtos;

public class VehicleDto : IdentifierDto
{
    public string Name { get; set; }
    public int OwnerId { get; set; }
    public string OwnerFirstName { get; set; }
    public string OwnerSureName { get; set; }
}
