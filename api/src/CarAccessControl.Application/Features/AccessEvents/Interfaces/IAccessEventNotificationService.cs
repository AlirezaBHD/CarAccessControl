using CarAccessControl.Application.Features.AccessEvents.Dtos;

namespace CarAccessControl.Application.Features.AccessEvents.Interfaces;

public interface IAccessEventNotificationService
{
    Task NotifyNewAccessEvent(RealTimeEventDto @event);
}