using CarAccessControl.Application.Common.Interfaces.Streaming;

namespace CarAccessControl.Infrastructure.Services.Streaming;

public class CameraStreamFactory : ICameraStreamFactory
{
    public ICameraStreamService Create(int cameraId, string url, int frameInterval)
    {
        return new OpenCvCameraStreamService(cameraId, url, frameInterval);
    }
}