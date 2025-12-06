namespace CarAccessControl.Application.Common.Models;

public class CameraFrameDto
{
    public int CameraId { get; set; }
    public string FrameBase64 { get; set; } = default!;

    public DateTime Timestamp { get; set; }
}
