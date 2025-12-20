namespace CarAccessControl.Application.Features.VehicleOwners.Dtos;

public class VehicleOwnerUpsertDto
{
    public required string FirstName { get; set; }
    public required string Surname { get; set; }
    public required string NationalCode { get; set; }
}