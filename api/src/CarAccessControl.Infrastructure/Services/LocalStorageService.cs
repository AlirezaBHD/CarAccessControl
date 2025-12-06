using CarAccessControl.Application.Common.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace CarAccessControl.Infrastructure.Services;

public class LocalStorageService(IWebHostEnvironment env) : IStorageService
{
    public async Task<string> SaveFileAsync(string fileName, byte[] content, string folderName)
    {
        var folderPath = Path.Combine(env.WebRootPath, folderName);
        
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var fullPath = Path.Combine(folderPath, fileName);
        
        await File.WriteAllBytesAsync(fullPath, content);

        return Path.Combine(folderName, fileName).Replace("\\", "/");
    }
}