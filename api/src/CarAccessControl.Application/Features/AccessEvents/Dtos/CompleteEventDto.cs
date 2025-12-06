namespace CarAccessControl.Application.Features.AccessEvents.Dtos;

public class CompleteEventDto
{
    public string? VehicleName { get; init; }
    
    public string? OwnerFirstName { get; init; }
    
    public string? OwnerSureName { get; init; }
    
    public bool Enter { get; init; } = true;
}