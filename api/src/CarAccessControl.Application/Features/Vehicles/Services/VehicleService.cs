using AutoMapper;
using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Application.Features.Vehicles.Interfaces;
using CarAccessControl.Application.Features.Vehicles.Specifications;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CarAccessControl.Application.Features.Vehicles.Services;

public class VehicleService(
    IMapper mapper,
    IVehicleRepository vehicleRepository,
    ILogger<Vehicle> logger)
    : IVehicleService
{
    public async Task<int> CreateAsync(VehicleUpsertDto upsertDto)
    {
        var entity = mapper.Map<VehicleUpsertDto, Vehicle>(upsertDto);

        await vehicleRepository.AddAsync(entity);
        await vehicleRepository.SaveAsync();

        logger.LogInformation("Created new Vehicle: {@Vehicle}", entity);

        return entity.Id;
    }
    
    
    public async Task UpdateAsync(int id, VehicleUpsertDto upsertDto)
    {
        var entity = await vehicleRepository.GetByIdAsync(id);
        entity = mapper.Map(upsertDto, entity);

        vehicleRepository.Update(entity);

        await vehicleRepository.SaveAsync();
        logger.LogInformation("Updated Vehicle with ID: {Id}. Data: {@Vehicle}", id, entity);
    }
    
    
    public async Task<IReadOnlyList<VehicleListDto>> GetListAsync()
    {
        var spc = new AllVehiclesSpec();
        var result = await vehicleRepository.ListProjectedAsync<VehicleListDto>(spc);
        return result;
    }
    
    
    public async Task<VehicleDetailDto> GetByIdAsync(int id)
    {
        var result = await vehicleRepository.GetByIdProjectedAsync<VehicleDetailDto>(id);
        return result;
    }
    
    
    public async Task DeleteAsync(int id)
    {
        var entity = await vehicleRepository.GetByIdAsync(id);
        vehicleRepository.Remove(entity);
        await vehicleRepository.SaveAsync();
        logger.LogInformation("Deleting Vehicle: {@Entity}", entity);
    }
}