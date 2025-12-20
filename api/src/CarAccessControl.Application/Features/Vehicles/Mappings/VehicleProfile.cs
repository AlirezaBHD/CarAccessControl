using AutoMapper;
using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.Vehicles.Mappings;

public class VehicleProfile : Profile
{
    public VehicleProfile()
    {
        CreateMap<VehicleUpsertDto, Vehicle>();
        
        CreateMap<Vehicle, VehicleDetailDto>();
        CreateMap<Vehicle, VehicleDto>();

        CreateMap<Vehicle, VehicleListDto>().ForMember(dest => dest.OwnerFullName, opt =>
            opt.MapFrom(src => $"{src.Owner.FirstName} {src.Owner.Surname}"));
    }
}