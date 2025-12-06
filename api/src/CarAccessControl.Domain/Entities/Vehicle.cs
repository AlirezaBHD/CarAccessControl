using System.ComponentModel.DataAnnotations;

namespace CarAccessControl.Domain.Entities;

public class Vehicle : BaseEntity
{
    [Length(2,100)]
    [StringLength(100)]
    public required string Name { get; set; }
    
    [Length(8,15)]
    [StringLength(15)]
    public required string PlateNumber { get; set; }
    
    public required int OwnerId { get; set; }
    
    public required VehicleOwner Owner { get; set; }
}