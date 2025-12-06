using Microsoft.AspNetCore.SignalR;

namespace CarAccessControl.Application.Features.AccessEvents.Hubs;

public class AccessEventHub : Hub
{
    public async Task JoinAccessEventGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "AccessEvents");
    }

    public async Task LeaveAccessEventGroup()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "AccessEvents");
    }

    public override async Task OnConnectedAsync()
    {
        await JoinAccessEventGroup();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await LeaveAccessEventGroup();
        await base.OnDisconnectedAsync(exception);
    }
}