using CarAccessControl.Application.Features.AccessEvents.Interfaces;

namespace CarAccessControl.Application.Features.AccessEvents.Services;

public class LicensePlateService : ILicensePlateService
{
    private string _lastPlate = string.Empty;
    private DateTime _lastPlateTime = DateTime.MinValue;
    private readonly TimeSpan _duplicateThreshold = TimeSpan.FromSeconds(10);

    public bool IsDuplicate(string plateNumber)
    {
        if (string.IsNullOrEmpty(_lastPlate) || 
            DateTime.UtcNow - _lastPlateTime > _duplicateThreshold)
        {
            return false;
        }

        return string.Equals(_lastPlate, plateNumber, StringComparison.OrdinalIgnoreCase);
    }

    public void AddPlate(string plateNumber)
    {
        if (string.IsNullOrEmpty(plateNumber))
        {
            return;
        }
        
        _lastPlate = plateNumber;
        _lastPlateTime = DateTime.UtcNow;
    }
}