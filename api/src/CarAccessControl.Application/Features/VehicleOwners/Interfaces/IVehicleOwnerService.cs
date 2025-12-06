using CarAccessControl.Application.Features.VehicleOwners.Dtos;

namespace CarAccessControl.Application.Features.VehicleOwners.Interfaces;

public interface IVehicleOwnerService
{
    Task<int> CreateAsync(VehicleOwnerUpsertDto upsertDto);

    Task UpdateAsync(int id, VehicleOwnerUpsertDto upsertDto);

    Task<IReadOnlyList<VehicleOwnerListDto>> GetListAsync();

    Task<VehicleOwnerDetailDto> GetByIdAsync(int id);

    Task DeleteAsync(int id);
}