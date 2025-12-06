using CarAccessControl.Domain.Interfaces;
using CarAccessControl.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CarAccessControl.Infrastructure.Data.Persistence;

namespace CarAccessControl.Infrastructure.Repositories;

public class Repository<T>(ApplicationDbContext context, IMapper mapper) : IRepository<T>
    where T : class
{
    private readonly DbSet<T> _entities = context.Set<T>();
    private IQueryable<T> LimitedQuery => _entities.AsQueryable();


    public async Task AddAsync(T entity) => await _entities.AddAsync(entity);


    public void Remove(T entity) => _entities.Remove(entity);


    public void Update(T entity) => _entities.Update(entity);


    public async Task SaveAsync()
    {
        await context.SaveChangesAsync();
    }


    public async Task<T> GetByIdAsync(int id)
    {
        var obj = await LimitedQuery.FirstOrDefaultAsync(e => EF.Property<int>(e, "Id") == id);
        return obj!;
    }
    

    public async Task<T?> GetEntityWithSpec(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync();
    }

    public async Task<TDto?> GetProjectedAsync<TDto>(ISpecification<T> spec)
    {
        var query = SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
    
        return await query
            .ProjectTo<TDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }

    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).CountAsync();
    }

    public async Task<TDto> GetByIdProjectedAsync<TDto>(int id)
    {
        var query = LimitedQuery.Where(e => EF.Property<int>(e, "Id") == id).AsNoTracking();
        
        return await query
            .ProjectTo<TDto>(mapper.ConfigurationProvider)
            .FirstAsync();
    }

    public async Task<IReadOnlyList<TDto>> ListProjectedAsync<TDto>(ISpecification<T> spec)
    {
        var query = SpecificationEvaluator<T>.GetQuery(LimitedQuery, spec);
        
        return await query
            .ProjectTo<TDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
    }
}