using CarAccessControl.Application.Common.Interfaces.Streaming;
using CarAccessControl.Application.Common.Models;
using OpenCvSharp;

namespace CarAccessControl.Infrastructure.Services.Streaming;

public class OpenCvCameraStreamService(
    int cameraId,
    string cameraUrl,
    int frameInterval) : ICameraStreamService
{
    private readonly Size _resizeTo = new(1920, 1080);

    public Task StopAsync()
    {
        return Task.CompletedTask;
    }
    public event Func<CameraFrameDto, Task>? OnFrameCaptured;

    public async Task StartAsync(CancellationToken token)
    {
        await Task.Run(async () =>
        {
            using var capture = new VideoCapture(cameraUrl, VideoCaptureAPIs.FFMPEG);
            if (!capture.IsOpened()) return; 

            int frameCounter = 0;

            while (!token.IsCancellationRequested)
            {
                using var frame = new Mat();
                if (!capture.Read(frame) || frame.Empty())
                {
                    await Task.Delay(50, token);
                    continue;
                }

                frameCounter++;
                if (frameCounter % frameInterval != 0) continue;

                using var resized = new Mat();
                Cv2.Resize(frame, resized, _resizeTo);
                
                var base64 = ConvertMatToBase64(resized);

                if (OnFrameCaptured != null)
                {
                    await OnFrameCaptured.Invoke(new CameraFrameDto
                    {
                        CameraId = cameraId,
                        FrameBase64 = base64,
                        Timestamp = DateTime.UtcNow
                    });
                }
            }
        }, token);
    }

    private static string ConvertMatToBase64(Mat mat)
    {
        Cv2.ImEncode(".jpg", mat, out var buffer);
        return Convert.ToBase64String(buffer);
    }
}