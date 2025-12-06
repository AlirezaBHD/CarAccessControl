using CarAccessControl.Application.Features.AccessEvents.Dtos;

namespace CarAccessControl.Application.Features.AccessEvents.Interfaces;

public interface IAccessEventService
{
    Task CreateAsync(int cameraId, string plate, string frameBase64);
    
    Task<IReadOnlyList<EventListDto>> GetListAsync();
    
    Task<EventDetailDto> GetByIdAsync(int id);
    
    Task<byte[]> CreateReportAsync(EventReportRequestDto dto);
    
    Task CompleteAccessEventAsync(int id, CompleteEventDto dto);
    
    Task DeleteEvent(int id);
}