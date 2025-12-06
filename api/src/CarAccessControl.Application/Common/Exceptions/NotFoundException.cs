namespace CarAccessControl.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string entityName) : base($"{entityName} Not Found") {}
}
