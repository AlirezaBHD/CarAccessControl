using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Gates.Dtos;

public class GateDetailDto : IdentifierDto
{
    public required string Name { get; init; }
    
    public required string Location { get; init; }
    
    public required int CameraId { get; init; }
    
    public required string CameraIp { get; init; }
    
    public bool IsActive { get; init; }
}