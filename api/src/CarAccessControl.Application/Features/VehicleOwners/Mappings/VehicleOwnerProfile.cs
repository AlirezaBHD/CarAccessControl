using AutoMapper;
using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.VehicleOwners.Mappings;

public class VehicleOwnerProfile : Profile
{
    public VehicleOwnerProfile()
    {
        CreateMap<VehicleOwnerUpsertDto, VehicleOwner>();
        
        CreateMap<VehicleOwner, VehicleOwnerDetailDto>();
        
        CreateMap<VehicleOwner, VehicleOwnerListDto>().ForMember(dest => dest.VehiclesCount, opt =>
            opt.MapFrom(src => src.Vehicles.Count));
    }
}