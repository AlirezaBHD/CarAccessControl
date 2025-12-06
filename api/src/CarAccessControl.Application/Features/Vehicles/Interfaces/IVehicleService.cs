using CarAccessControl.Application.Features.Vehicles.Dtos;

namespace CarAccessControl.Application.Features.Vehicles.Interfaces;

public interface IVehicleService
{
    Task<int> CreateAsync(VehicleUpsertDto upsertDto);
    
    Task UpdateAsync(int id, VehicleUpsertDto upsertDto);
    
    Task<IReadOnlyList<VehicleListDto>> GetListAsync();
    
    Task<VehicleDetailDto> GetByIdAsync(int id);
    
    Task DeleteAsync(int id);
}