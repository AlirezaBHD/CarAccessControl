using System.Collections.Concurrent;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CarAccessControl.Application.Common.Interfaces.Streaming;
using CarAccessControl.Application.Common.Models;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using CarAccessControl.Application.Features.Cameras.Dtos;
using CarAccessControl.Application.Features.Cameras.Specifications;
using CarAccessControl.Domain.Interfaces;

namespace CarAccessControl.Infrastructure.BackgroundJobs;

public class CameraManagerWorker(
    IServiceScopeFactory scopeFactory,
    ICameraStreamFactory streamFactory,
    ILicensePlateRecognizer recognizer,
    ILogger<CameraManagerWorker> logger
    ) : BackgroundService
{
    private readonly ConcurrentDictionary<int, (ICameraStreamService Service, CancellationTokenSource Cts)> _running = new();
    
    private readonly SemaphoreSlim _resetLock = new(1, 1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation("Camera Manager Worker is starting...");
        await StartAllAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
        
        logger.LogInformation("Camera Manager Worker is stopping...");
        await StopAllAsync();
    }
    
    public async Task ResetAsync(CancellationToken token = default)
    {
        await _resetLock.WaitAsync(token);

        try
        {
            logger.LogInformation("Resetting all camera streams...");
            await StopAllAsync();
            await StartAllAsync(token);
        }
        finally
        {
            _resetLock.Release();
        }
    }

    private async Task StartAllAsync(CancellationToken stoppingToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            
            var cameraRepository = scope.ServiceProvider.GetRequiredService<ICameraRepository>();
            
            var activeCamerasSpec = new ActiveGateCamerasSpec(); 
            var cameras = await cameraRepository.ListProjectedAsync<CameraDto>(activeCamerasSpec);

            logger.LogInformation("Found {Count} active cameras to start.", cameras.Count);

            foreach (var cam in cameras)
            {
                if (_running.ContainsKey(cam.Id)) continue;

                ICameraStreamService service = streamFactory.Create(cam.Id, cam.Url, cam.FrameInterval);

                service.OnFrameCaptured += HandleFrameAsync;

                var cts = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                
                if (_running.TryAdd(cam.Id, (service, cts)))
                {
                    _ = Task.Run(async () => 
                    {
                        try
                        {
                            logger.LogInformation("Starting stream for Camera {Id}", cam.Id);
                            await service.StartAsync(cts.Token);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex, "Error running stream for Camera {Id}", cam.Id);
                        }
                    }, cts.Token);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in StartAllAsync");
        }
    }

    private async Task StopAllAsync()
    {
        logger.LogInformation("Stopping all camera streams...");
        foreach (var key in _running.Keys)
        {
            if (_running.TryRemove(key, out var item))
            {
                try
                {
                    await item.Cts.CancelAsync();
                    await item.Service.StopAsync();
                    item.Service.OnFrameCaptured -= HandleFrameAsync;
                    item.Cts.Dispose();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error stopping camera {Id}", key);
                }
            }
        }
    }

    private async Task HandleFrameAsync(CameraFrameDto frame)
    {
        try 
        {
            var plate = await recognizer.RecognizeAsync(frame.FrameBase64);
            
            if (string.IsNullOrWhiteSpace(plate)) return;

            using var scope = scopeFactory.CreateScope();
            var eventService = scope.ServiceProvider.GetRequiredService<IAccessEventService>();
            
            await eventService.CreateAsync(frame.CameraId, plate, frame.FrameBase64);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error processing frame from Camera {Id}", frame.CameraId);
        }
    }
}