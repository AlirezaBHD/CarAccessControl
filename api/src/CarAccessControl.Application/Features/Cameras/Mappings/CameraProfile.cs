using AutoMapper;
using CarAccessControl.Application.Features.Cameras.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Cameras.Mappings;

public class CameraProfile : Profile
{
    public CameraProfile()
    {
        CreateMap<CameraUpsertDto, Camera>();
        
        CreateMap<Camera, CameraDto>();
        
        CreateMap<Camera, CameraDetailDto>().ForMember(dest => dest.GateName, opt =>
            opt.MapFrom(src => src.Gate!.Name)
        ).ForMember(dest => dest.GateId, opt =>
            opt.MapFrom(src => src.Gate!.Id));
        
        CreateMap<Camera, CameraListDto>().ForMember(dest => dest.GateName, opt =>
            opt.MapFrom(src => src.Gate!.Name));
    }
}