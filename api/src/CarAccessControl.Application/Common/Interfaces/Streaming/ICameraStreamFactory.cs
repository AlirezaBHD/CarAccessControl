namespace CarAccessControl.Application.Common.Interfaces.Streaming;

public interface ICameraStreamFactory
{
    ICameraStreamService Create(int cameraId, string url, int frameInterval);
}