using AutoMapper;
using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Application.Features.Gates.Interfaces;
using CarAccessControl.Application.Features.Gates.Specifications;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CarAccessControl.Application.Features.Gates.Services;

public class GateService(
    IMapper mapper,
    IGateRepository gateRepository,
    ILogger<Gate> logger)
    :IGateService
{
    public async Task<int> CreateAsync(GateUpsertDto upsertDto)
    {
        var entity = mapper.Map<GateUpsertDto, Gate>(upsertDto);

        await gateRepository.AddAsync(entity);
        await gateRepository.SaveAsync();

        logger.LogInformation("Created new Gate: {@Gate}", entity);
        
        return entity.Id;
    }
    
    
    public async Task UpdateAsync(int id, GateUpsertDto upsertDto)
    {
        var entity = await gateRepository.GetByIdAsync(id);
        entity = mapper.Map(upsertDto, entity);

        gateRepository.Update(entity);

        await gateRepository.SaveAsync();
        logger.LogInformation("Updated Gate with ID: {Id}. Data: {@Gate}", id, entity);
    }
    
    
    public async Task<IReadOnlyList<GateListDto>> GetListAsync()
    {
        var spc = new AllGatesSpec();
        var result = await gateRepository.ListProjectedAsync<GateListDto>(spc);
        return result;
    }
    
    
    public async Task<GateDetailDto> GetByIdAsync(int id)
    {
        var result = await gateRepository.GetByIdProjectedAsync<GateDetailDto>(id);
        return result;
    }
    
    
    public async Task DeleteAsync(int id)
    {
        var entity = await gateRepository.GetByIdAsync(id);
        gateRepository.Remove(entity);
        await gateRepository.SaveAsync();
        logger.LogInformation("Deleting Gate: {@Entity}", entity);
    }
}