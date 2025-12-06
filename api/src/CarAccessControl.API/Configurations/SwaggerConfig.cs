using Microsoft.OpenApi.Models;

namespace CarAccessControl.API.Configurations;

public static class SwaggerConfig
{
    public static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSwaggerGen(c =>
        {
            c.EnableAnnotations();
            var securitySchema = new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            };

            c.AddSecurityDefinition("Bearer", securitySchema);

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    securitySchema,
                    ["Bearer"]
                }
            });
            
        });

        
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Version = "v1",
                Title = "CarAccessControl API",
                Description = "Access Control service for Vehicles.",
                Contact = new OpenApiContact
                {
                    Name = "Repository",
                    Url = new Uri("https://github.com/AlirezaBHD/CarAccessControl")
                }
            });
        });

        
        return services;
    }

    public static IApplicationBuilder UseSwaggerDocumentation(this IApplicationBuilder app)
    {
        app.UseSwagger();
        
        app.UseSwaggerUI(options =>
        {
            options.InjectStylesheet("/swagger-ui/SwaggerDark.css");
        });
        
        app.UseDeveloperExceptionPage();


        return app;
    }
}
