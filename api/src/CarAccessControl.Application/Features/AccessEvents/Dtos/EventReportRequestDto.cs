namespace CarAccessControl.Application.Features.AccessEvents.Dtos;

public class EventReportRequestDto
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int? OwnerId { get; init; }
    public int? VehicleId { get; init; }
}