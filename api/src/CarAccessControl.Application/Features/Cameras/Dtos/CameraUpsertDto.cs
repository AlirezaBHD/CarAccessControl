namespace CarAccessControl.Application.Features.Cameras.Dtos;

public class CameraUpsertDto
{
    public required string Ip { get; set; }
    
    public required string Url { get; set; }
    
    public int FrameInterval { get; set; }
}