using System.ComponentModel.DataAnnotations;

namespace CarAccessControl.Domain.Entities;

public class Person : BaseEntity
{
    [Length(2,50)]
    [StringLength(50)]
    public string? FirstName { get; set; }
    
    [Length(2,50)]
    [StringLength(50)]
    public required string SureName { get; set; }
    
    [Length(10,10)]
    [StringLength(10)]
    public string? NationalCode { get; set; }
}