namespace CarAccessControl.Application.Features.AccessEvents.Dtos;

public class RealTimeEventDto
{
    public int Id { get; init; }
    
    public string PlateNumber { get; init; } = string.Empty;
    
    public string? ImagePath { get; init; }
    
    public int VehicleId { get; init; }
    
    public int OwnerId { get; init; }
    
    public int GateId { get; init; }
    
    public string? OwnerFirstName { get; init; }
    
    public string? OwnerSurname { get; init; }
    
    public string? VehicleName { get; init; }
    
    public int CameraId { get; init; }
    
    public string CameraIp { get; init; } = string.Empty;
    
    public DateTime CreatedOn { get; init; }
    
    public bool IsAllowed { get; init; }
}