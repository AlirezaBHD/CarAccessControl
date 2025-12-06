namespace CarAccessControl.Application.Shared.Dtos;

public class BaseDto : IdentifierDto
{
    public DateTime CreatedOn { get; set; }
    
    public DateTime ModifiedOn { get; set; }
}