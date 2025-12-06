using AutoMapper;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data.Persistence;

namespace CarAccessControl.Infrastructure.Repositories;

public class VehicleOwnerRepository(ApplicationDbContext context, IMapper mapper)
    : Repository<VehicleOwner>(context, mapper), IVehicleOwnerRepository;