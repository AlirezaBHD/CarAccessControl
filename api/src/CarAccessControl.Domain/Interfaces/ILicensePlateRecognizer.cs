namespace CarAccessControl.Domain.Interfaces;

public interface ILicensePlateRecognizer
{
    Task<string?> RecognizeAsync(string base64Image);
}
