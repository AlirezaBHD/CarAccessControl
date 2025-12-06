using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarAccessControl.Domain.Entities;

public abstract class BaseEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    
    public DateTime ModifiedOn { get; set; } = DateTime.UtcNow;
}
