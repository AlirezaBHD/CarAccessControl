namespace CarAccessControl.Application.Features.AccessEvents.Interfaces;

public interface ILicensePlateService
{
    bool IsDuplicate(string plateNumber);
    
    void AddPlate(string plateNumber);
}