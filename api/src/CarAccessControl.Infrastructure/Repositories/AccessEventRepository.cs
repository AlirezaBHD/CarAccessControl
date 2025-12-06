using AutoMapper;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data.Persistence;

namespace CarAccessControl.Infrastructure.Repositories;

public class AccessEventRepository(ApplicationDbContext context, IMapper mapper)
    : Repository<AccessEvent>(context, mapper), IAccessEventRepository;