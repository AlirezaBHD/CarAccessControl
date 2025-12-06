namespace CarAccessControl.Application.Common.Interfaces;

public interface IStorageService
{
    Task<string> SaveFileAsync(string fileName, byte[] content, string folderName);
}