using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Cameras.Dtos;

public class CameraDto : IdentifierDto
{
    public required string Url { get; init; }

    public required int FrameInterval { get; init; }
}