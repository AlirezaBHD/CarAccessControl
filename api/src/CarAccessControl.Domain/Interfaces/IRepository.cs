namespace CarAccessControl.Domain.Interfaces;

public interface IRepository<T> where T : class
{
    Task AddAsync(T entity);
    
    void Remove(T entity);
    
    void Update(T entity);
    
    Task SaveAsync();
    
    Task<T> GetByIdAsync(int id);
    
    Task<T?> GetEntityWithSpec(ISpecification<T> spec);
    
    Task<TDto?> GetProjectedAsync<TDto>(ISpecification<T> spec);
    
    Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
    
    Task<int> CountAsync(ISpecification<T> spec);
    
    Task<TDto> GetByIdProjectedAsync<TDto>(int id);
    
    Task<IReadOnlyList<TDto>> ListProjectedAsync<TDto>(ISpecification<T> spec);
}
    