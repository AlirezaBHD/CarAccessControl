using AutoMapper;
using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Gates.Mappings;


public class GateProfile : Profile
{
    public GateProfile()
    {
        CreateMap<GateUpsertDto, Gate>();

        CreateMap<Gate, GateDto>().ForMember(dest => dest.CameraIp, opt =>
            opt.MapFrom(src => src.Camera.Ip));
        
        CreateMap<Gate, GateDetailDto>().ForMember(dest => dest.CameraIp, opt =>
            opt.MapFrom(src => src.Camera.Ip)
        );
        
        CreateMap<Gate, GateListDto>().ForMember(dest => dest.CameraIp, opt =>
            opt.MapFrom(src => src.Camera.Ip)
        );
    }
}