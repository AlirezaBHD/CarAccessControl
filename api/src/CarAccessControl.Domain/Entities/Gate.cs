using System.ComponentModel.DataAnnotations;

namespace CarAccessControl.Domain.Entities;

public class Gate : BaseEntity
{
    [Length(2,200)]
    [StringLength(200)]
    public required string Name { get; set; }
    
    [Length(2,200)]
    [StringLength(20)]
    public required string Location { get; set; }
    
    public bool IsActive { get; set; }
    
    public required int CameraId { get; set; }
    
    public required Camera Camera { get; set; }
}