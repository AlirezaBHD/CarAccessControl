using CarAccessControl.Application.Shared.Dtos;

namespace CarAccessControl.Application.Features.Cameras.Dtos;

public class CameraDetailDto : BaseDto
{
    public required string Ip { get; init; }

    public required string Url { get; init; }

    public required int FrameInterval { get; init; }

    public string? GateName { get; init; }

    public int? GateId { get; init; }
}