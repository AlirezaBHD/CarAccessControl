using CarAccessControl.Application.Common.Models;

namespace CarAccessControl.Application.Common.Interfaces.Streaming;

public interface ICameraStreamService
{
    Task StartAsync(CancellationToken token);
    
    Task StopAsync();

    event Func<CameraFrameDto, Task> OnFrameCaptured;
}
