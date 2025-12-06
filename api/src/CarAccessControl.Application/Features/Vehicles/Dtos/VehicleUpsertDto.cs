namespace CarAccessControl.Application.Features.Vehicles.Dtos;

public class VehicleUpsertDto
{
    public required string Name { get; set; }
    public required string PlateNumber { get; set; }
    public int OwnerId { get; set; }
}