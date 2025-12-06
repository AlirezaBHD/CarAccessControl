using AutoMapper;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data.Persistence;

namespace CarAccessControl.Infrastructure.Repositories;

public class VehicleRepository(ApplicationDbContext context, IMapper mapper)
    : Repository<Vehicle>(context, mapper), IVehicleRepository;