using CarAccessControl.API.Configurations;
using CarAccessControl.Application;
using CarAccessControl.Application.Features.AccessEvents.Hubs;
using CarAccessControl.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

builder.Services.AddControllers();
services.AddSwaggerDocumentation(configuration);
services.AddAppControllers();
services.AddAppCors(configuration);
services.AddHttpContextAccessor();
services.AddInfrastructure(configuration);
services.AddApplication();
services.AddAppDbContext(configuration);
services.AddAuthorization();
services.AddHttpContextAccessor();


var app = builder.Build();
app.UseCors("AllowAll");
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

Console.Write("started");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<AccessEventHub>("/hubs/access-events");


app.Run();