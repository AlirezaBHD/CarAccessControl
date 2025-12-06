using AutoMapper;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data.Persistence;

namespace CarAccessControl.Infrastructure.Repositories;

public class CameraRepository(ApplicationDbContext context, IMapper mapper)
    : Repository<Camera>(context, mapper), ICameraRepository;