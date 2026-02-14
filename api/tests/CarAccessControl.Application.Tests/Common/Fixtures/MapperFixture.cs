using AutoMapper;
using CarAccessControl.Application.Features.Cameras.Mappings;

namespace CarAccessControl.Application.Tests.Common.Fixtures;

public class MapperFixture : IDisposable
{
    public IMapper Mapper { get; }

    public MapperFixture()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<CameraProfile>();
        });

        Mapper = config.CreateMapper();
    }

    public void Dispose() => GC.SuppressFinalize(this);
}

[CollectionDefinition("Mapper")]
public class MapperCollection : ICollectionFixture<MapperFixture>;