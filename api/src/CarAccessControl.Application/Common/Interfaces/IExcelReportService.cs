using CarAccessControl.Application.Features.AccessEvents.Dtos;

namespace CarAccessControl.Application.Common.Interfaces;

public interface IExcelReportService
{
    Task<byte[]> GenerateAccessEventReportAsync(List<EventListDto> events, DateTime fromDate, DateTime toDate);
}