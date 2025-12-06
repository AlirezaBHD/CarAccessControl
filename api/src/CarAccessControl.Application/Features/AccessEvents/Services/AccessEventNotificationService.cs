using CarAccessControl.Application.Features.AccessEvents.Dtos;
using CarAccessControl.Application.Features.AccessEvents.Hubs;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace CarAccessControl.Application.Features.AccessEvents.Services;

public class AccessEventNotificationService(IHubContext<AccessEventHub> hubContext) : IAccessEventNotificationService
{
    public async Task NotifyNewAccessEvent(RealTimeEventDto @event)
    {
        await hubContext.Clients.Group("AccessEvents")
            .SendAsync("NewAccessEvent", @event);
    }
}