using CarAccessControl.Application.Features.Cameras.Dtos;

namespace CarAccessControl.Application.Features.Cameras.Interfaces;

public interface ICameraService
{
    Task<int> CreateAsync(CameraUpsertDto dto);
    
    Task UpdateAsync(int id, CameraUpsertDto dto);
    
    Task<IReadOnlyList<CameraListDto>> GetListAsync();
    
    Task<CameraDetailDto> GetByIdAsync(int id);
    
    Task DeleteAsync(int id);
}