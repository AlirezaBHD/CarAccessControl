using System.Net;
using System.Net.Http.Json;
using CarAccessControl.Domain.Interfaces;

namespace CarAccessControl.Infrastructure.Services;

public class HttpLicensePlateRecognizerService(HttpClient http) : ILicensePlateRecognizer
{
    public async Task<string?> RecognizeAsync(string base64Image)
    {
        var payload = new { image_base64 = base64Image };

        var response = await http.PostAsJsonAsync("/read_license_plate", payload);

        if (response.StatusCode != (HttpStatusCode)200)
            return null;

        var json = await response.Content.ReadFromJsonAsync<Dictionary<string,string>>();

        return json?["license"];
    }
}
