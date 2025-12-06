using AutoMapper;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CarAccessControl.Infrastructure.Repositories;

public class GateRepository(ApplicationDbContext context, IMapper mapper)
    : Repository<Gate>(context, mapper), IGateRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<IEnumerable<Camera>> GetActiveCameras()
    {
        var result =await _context.Gates.Where(g => g.IsActive).Include(g => g.Camera)
            .Select(g => g.Camera).ToListAsync();
        return result;
    }
}