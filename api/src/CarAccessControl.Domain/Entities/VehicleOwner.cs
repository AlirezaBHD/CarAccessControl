namespace CarAccessControl.Domain.Entities;

public class VehicleOwner : Person
{
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}