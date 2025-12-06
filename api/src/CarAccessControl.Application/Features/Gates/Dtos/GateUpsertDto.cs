namespace CarAccessControl.Application.Features.Gates.Dtos;

public class GateUpsertDto
{
    public required string Name { get; set; }
    public required string Location { get; set; }
    public int CameraId { get; set; }
    public bool IsActive { get; set; }
}