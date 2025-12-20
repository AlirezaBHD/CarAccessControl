using System.ComponentModel.DataAnnotations;

namespace CarAccessControl.Domain.Entities;

public class AccessEvent : BaseEntity
{
    [StringLength(15)]
    public required string PlateNumber { get; init; }
    
    [StringLength(48)]
    public required string ImagePath { get; init; }
    
    [StringLength(100)]
    public string? VehicleName { get; init; }
    public int? VehicleId { get; init; }
    
    [StringLength(50)]
    public string? OwnerFirstName { get; init; }
    
    [StringLength(50)]
    public string? OwnerSurname { get; init; }
    public int? OwnerId { get; init; }
    
    [StringLength(200)]
    public required string GateName { get; init; }
    public required int GateId { get; init; }

    [StringLength(15)]
    public required string CameraIp { get; init; }
    public required int CameraId { get; init; }
    
    public bool IsAllowed { get; init; }
    
    public bool? Enter { get; init; } = null;
}