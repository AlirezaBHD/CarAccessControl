using CarAccessControl.Application.Shared.Dtos;
using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Application.Features.VehicleOwners.Dtos;

public class VehicleOwnerDetailDto : IdentifierDto
{
    public required string FirstName { get; init; }
    
    public required string SureName { get; init; }
    
    public required string NationalCode { get; init; }
    
    public ICollection<Vehicle> Vehicles { get; init; } = new List<Vehicle>();
}