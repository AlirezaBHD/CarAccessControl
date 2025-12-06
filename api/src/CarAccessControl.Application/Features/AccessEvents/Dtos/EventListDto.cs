namespace CarAccessControl.Application.Features.AccessEvents.Dtos;

public class EventListDto
{
    public  int Id { get; init; }
    
    public required string PlateNumber { get; init; }
    
    public string? VehicleName { get; init; }
    
    public string? OwnerFirstName { get; init; }
    
    public required string OwnerSureName { get; init; }
    
    public required string GateName { get; init; }
    
    public bool IsAllowed { get; init; }
    public bool Enter { get; init; }
    
    public DateTime CreatedOn { get; set; }
}