using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Gates.Dtos;

public class GateDto : IdentifierDto
{
    public required string Name { get; set; }
    public required string CameraIp { get; set; }
}