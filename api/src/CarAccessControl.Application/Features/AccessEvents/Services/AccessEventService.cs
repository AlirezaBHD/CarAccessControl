using AutoMapper;
using CarAccessControl.Application.Common.Exceptions;
using CarAccessControl.Application.Common.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Dtos;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Specifications;
using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Application.Features.Gates.Specifications;
using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Application.Features.Vehicles.Specifications;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CarAccessControl.Application.Features.AccessEvents.Services;

public class AccessEventService(
    IMapper mapper,
    IAccessEventRepository accessEventRepository,
    IGateRepository gateRepository,
    IVehicleRepository vehicleRepository,
    ILogger<AccessEvent> logger,
    IExcelReportService excelReportService,
    IAccessEventNotificationService notificationService,
    ILicensePlateService licensePlateService,
    IStorageService storageService)
    : IAccessEventService
{
    public async Task CreateAsync(int cameraId, string plate, string frameBase64)
    {
        if (licensePlateService.IsDuplicate(plate))
        {
            return;
        }

        licensePlateService.AddPlate(plate);

        var vehicleSpec = new VehicleWithOwnerSpec(plate);
        var vehicle = await vehicleRepository.GetProjectedAsync<VehicleDto>(vehicleSpec);

        var cameraSpec = new GateByCameraIdSpec(cameraId);
        var gate = await gateRepository.GetProjectedAsync<GateDto>(cameraSpec);

        if (gate == null)
        {
            logger.LogCritical(
                "No Gate found for access event. Camera ID: {CameraId}, License Plate: {Plate}", 
                cameraId, plate
            );
            throw new ValidationException($"Gate not found for Camera ID: {cameraId}");
        }
        
        var bytes = Convert.FromBase64String(frameBase64);
        var fileName = $"{cameraId}_{DateTime.UtcNow:HHmmssfff}.jpg";
        var imagePath = await storageService.SaveFileAsync(fileName, bytes, "plates");

        var accessEvent = new AccessEvent
        {
            CameraId = cameraId,
            GateName = gate.Name,
            GateId = gate.Id,
            OwnerId = vehicle?.OwnerId,
            OwnerFirstName = vehicle?.OwnerFirstName,
            OwnerSurname = vehicle?.OwnerSurname,
            VehicleId = vehicle?.Id,
            VehicleName = vehicle?.Name,
            PlateNumber = plate,
            IsAllowed = true,
            CameraIp = gate.CameraIp,
            ImagePath = imagePath
        };

        await accessEventRepository.AddAsync(accessEvent);
        await accessEventRepository.SaveAsync();

        logger.LogInformation("Created new AccessEvent: {@AccessEvent}", accessEvent);

        var realTimeEvent = mapper.Map<RealTimeEventDto>(accessEvent);
        await notificationService.NotifyNewAccessEvent(realTimeEvent);
    }
    
    public async Task<IReadOnlyList<EventListDto>> GetListAsync()
    {
        var spc = new AllAccessEventsSpec();
        var result = await accessEventRepository.ListProjectedAsync<EventListDto>(spc);

        return result;
    }
    
    
    public async Task<EventDetailDto> GetByIdAsync(int id)
    {
        var result =
            await accessEventRepository.GetByIdProjectedAsync<EventDetailDto>(id);
        return result;
    }
    
    
    public async Task<byte[]> CreateReportAsync(EventReportRequestDto dto)
    {
        
        var spc = new ReportSpec(dto.FromDate, dto.ToDate, dto.OwnerId, dto.VehicleId);

        var events = await accessEventRepository.ListProjectedAsync<EventListDto>(spc);
        var result = await excelReportService.GenerateAccessEventReportAsync(events.ToList(), dto.FromDate, dto.ToDate);

        return result;
    }
    
    
    public async Task CompleteAccessEventAsync(int id, CompleteEventDto dto)
    {
        var entity = await accessEventRepository.GetByIdAsync(id);
        entity = mapper.Map(dto, entity);

        accessEventRepository.Update(entity);

        await accessEventRepository.SaveAsync();
        logger.LogInformation("Updated AccessEvent with ID: {Id}. Data: {@Event}", id, entity);
    }
    
    
    public async Task DeleteEvent(int id)
    {
        var entity = await accessEventRepository.GetByIdAsync(id);
        accessEventRepository.Remove(entity);
        await accessEventRepository.SaveAsync();
        logger.LogInformation("Deleted AccessEvent with ID: {Id}. Data: {@Event}", id, entity);

    }
}