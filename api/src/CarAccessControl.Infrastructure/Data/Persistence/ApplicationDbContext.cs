using CarAccessControl.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CarAccessControl.Infrastructure.Data.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker
            .Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            entry.Entity.ModifiedOn = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var baseEntityType = typeof(BaseEntity);
        var entityTypes = modelBuilder.Model.GetEntityTypes()
            .Where(t => t.ClrType is { IsClass: true, IsAbstract: false } && baseEntityType.IsAssignableFrom(t.ClrType));

        foreach (var entityType in entityTypes)
        {
            modelBuilder.Entity(entityType.ClrType)
                .Property(nameof(BaseEntity.Id))
                .ValueGeneratedOnAdd();
        }
        
    }
    
    public DbSet<Camera> Cameras => Set<Camera>();
    public DbSet<Gate> Gates => Set<Gate>();
    public DbSet<VehicleOwner> VehicleOwners => Set<VehicleOwner>();
    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<AccessEvent> AccessEvents => Set<AccessEvent>();
}