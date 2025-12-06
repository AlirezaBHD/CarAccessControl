using CarAccessControl.Application.Features.Gates.Dtos;

namespace CarAccessControl.Application.Features.Gates.Interfaces;

public interface IGateService
{
    Task<int> CreateAsync(GateUpsertDto upsertDto);
    
    Task UpdateAsync(int id, GateUpsertDto upsertDto);
    
    Task<IReadOnlyList<GateListDto>> GetListAsync();
    
    Task<GateDetailDto> GetByIdAsync(int id);
    
    Task DeleteAsync(int id);
}