using System.ComponentModel.DataAnnotations;

namespace CarAccessControl.Domain.Entities;

public class Camera: BaseEntity
{
    [Length(15,15)]
    [StringLength(15)]
    public required string Ip { get; set; }
    
    
    [StringLength(400)]
    public required string Url { get; set; }


    public int FrameInterval { get; set; } = 15;

    
    public Gate? Gate { get; set; }
}