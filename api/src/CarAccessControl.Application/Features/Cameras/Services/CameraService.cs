using AutoMapper;
using CarAccessControl.Application.Features.Cameras.Dtos;
using CarAccessControl.Application.Features.Cameras.Interfaces;
using CarAccessControl.Application.Features.Cameras.Specifications;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CarAccessControl.Application.Features.Cameras.Services;

public class CameraService(
    IMapper mapper,
    ICameraRepository cameraRepository,
    ILogger<Camera> logger)
    : ICameraService
{
    public async Task<int> CreateAsync(CameraUpsertDto dto)
    {
        var entity = mapper.Map<CameraUpsertDto, Camera>(dto);
        
        await cameraRepository.AddAsync(entity);
        await cameraRepository.SaveAsync();
        
        logger.LogInformation("Created new Camera: {@Camera}", entity);
        
        return entity.Id;
    }
    
    
    public async Task UpdateAsync(int id, CameraUpsertDto dto)
    {
        var entity = await cameraRepository.GetByIdAsync(id);
        entity = mapper.Map(dto, entity);

        cameraRepository.Update(entity);

        await cameraRepository.SaveAsync();
        logger.LogInformation("Updated Camera with ID: {Id}. Data: {@Camera}", id, entity);
    }
    
    
    public async Task<IReadOnlyList<CameraListDto>> GetListAsync()
    {
        var spc = new AllCamerasSpec();
        var result = await cameraRepository.ListProjectedAsync<CameraListDto>(spc);
        return result;
    }
    
    
    public async Task<CameraDetailDto> GetByIdAsync(int id)
    {
        var result = await cameraRepository.GetByIdProjectedAsync<CameraDetailDto>(id);
        return result;
    }
    
    
    public async Task DeleteAsync(int id)
    {
        var entity = await cameraRepository.GetByIdAsync(id);
        cameraRepository.Remove(entity);
        await cameraRepository.SaveAsync();
        logger.LogInformation("Deleting Camera: {@Entity}", entity);
    }
}