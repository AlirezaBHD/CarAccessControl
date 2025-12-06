using AutoMapper;
using CarAccessControl.Application.Features.AccessEvents.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.AccessEvents.Mappings;


public class AccessEventProfile : Profile
{
    public AccessEventProfile()
    {
        CreateMap<AccessEvent, EventDetailDto>();
        
        CreateMap<AccessEvent, EventListDto>();
        
        CreateMap<CompleteEventDto, AccessEvent>();
        
        CreateMap<AccessEvent, RealTimeEventDto>();
    }
}