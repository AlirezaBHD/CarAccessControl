using CarAccessControl.Domain.Entities;

namespace CarAccessControl.Domain.Interfaces;

public interface IGateRepository: IRepository<Gate>
{
    Task<IEnumerable<Camera>> GetActiveCameras();
}