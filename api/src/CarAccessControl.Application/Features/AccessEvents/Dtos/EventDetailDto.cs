namespace CarAccessControl.Application.Features.AccessEvents.Dtos;

public class EventDetailDto
{
    public  int Id { get; init; }
    
    public required string PlateNumber { get; init; }
    
    public required string ImagePath { get; init; }
    
    public string? VehicleName { get; init; }
    public required int VehicleId { get; init; }
    
    public string? OwnerFirstName { get; init; }
    
    public required string OwnerSureName { get; init; }
    public required int OwnerId { get; init; }
    
    public required string GateName { get; init; }
    public required int GateId { get; init; }

    public required string CameraIp { get; init; }
    public required int CameraId { get; init; }
    
    public bool IsAllowed { get; init; }
    
    public DateTime CreatedOn { get; set; }
}