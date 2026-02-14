using AutoMapper;
using CarAccessControl.Application.Features.Cameras.Mappings;
using CarAccessControl.Application.Features.Gates.Mappings;
using CarAccessControl.Application.Features.VehicleOwners.Mappings;

namespace CarAccessControl.Application.Tests.Common.Fixtures;

public class MapperFixture : IDisposable
{
    public IMapper Mapper { get; }

    public MapperFixture()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<CameraProfile>();
            cfg.AddProfile<GateProfile>();
            cfg.AddProfile<VehicleOwnerProfile>();
        });

        Mapper = config.CreateMapper();
    }

    public void Dispose() => GC.SuppressFinalize(this);
}

[CollectionDefinition("Mapper")]
public class MapperCollection : ICollectionFixture<MapperFixture>;