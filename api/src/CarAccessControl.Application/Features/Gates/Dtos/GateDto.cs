using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Gates.Dtos;

public class GateDto : IdentifierDto
{
    public string Name { get; set; }
    public string CameraIp { get; set; }
}