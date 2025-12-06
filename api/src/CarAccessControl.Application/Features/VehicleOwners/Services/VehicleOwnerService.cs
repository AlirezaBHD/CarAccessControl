using AutoMapper;
using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Application.Features.VehicleOwners.Interfaces;
using CarAccessControl.Application.Features.VehicleOwners.Specifications;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CarAccessControl.Application.Features.VehicleOwners.Services;

public class VehicleOwnerService(
    IMapper mapper,
    IVehicleOwnerRepository vehicleOwnerRepository,
    ILogger<VehicleOwner> logger)
    : IVehicleOwnerService
{
    public async Task<int> CreateAsync(VehicleOwnerUpsertDto upsertDto)
    {
        var entity = mapper.Map<VehicleOwnerUpsertDto, VehicleOwner>(upsertDto);

        await vehicleOwnerRepository.AddAsync(entity);
        await vehicleOwnerRepository.SaveAsync();

        logger.LogInformation("Created new VehicleOwner: {@VehicleOwner}", entity);
        
        return entity.Id;
    }
    
    
    public async Task UpdateAsync(int id, VehicleOwnerUpsertDto upsertDto)
    {
        var entity = await vehicleOwnerRepository.GetByIdAsync(id);
        entity = mapper.Map(upsertDto, entity);

        vehicleOwnerRepository.Update(entity);

        await vehicleOwnerRepository.SaveAsync();
        logger.LogInformation("Updated VehicleOwner with ID: {Id}. Data: {@VehicleOwner}", id, entity);
    }
    
    
    public async Task<IReadOnlyList<VehicleOwnerListDto>> GetListAsync()
    {
        var spc = new AllVehicleOwnersSpec();

        var result = await vehicleOwnerRepository.ListProjectedAsync<VehicleOwnerListDto>(spc);
        return result;
    }
    
    
    public async Task<VehicleOwnerDetailDto> GetByIdAsync(int id)
    {
        var result = await vehicleOwnerRepository.GetByIdProjectedAsync<VehicleOwnerDetailDto>(id);
        return result;
    }
    
    
    public async Task DeleteAsync(int id)
    {
        var entity = await vehicleOwnerRepository.GetByIdAsync(id);
        vehicleOwnerRepository.Remove(entity);
        await vehicleOwnerRepository.SaveAsync();
        logger.LogInformation("Deleting VehicleOwner: {@Entity}", entity);
    }
}