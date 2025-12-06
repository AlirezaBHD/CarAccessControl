using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Dtos;

public class VehicleDetailDto : BaseDto
{
    public required string Name { get; set; }
    public required string PlateNumber { get; set; }
    public int OwnerId { get; set; }
    public required VehicleOwnerDetailDto OwnerDetail { get; set; }
}