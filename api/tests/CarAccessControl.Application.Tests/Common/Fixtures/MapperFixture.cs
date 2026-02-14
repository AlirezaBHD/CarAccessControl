using AutoMapper;
using CarAccessControl.Application.Features.AccessEvents.Mappings;
using CarAccessControl.Application.Features.Cameras.Mappings;
using CarAccessControl.Application.Features.Gates.Mappings;
using CarAccessControl.Application.Features.VehicleOwners.Mappings;
using CarAccessControl.Application.Features.Vehicles.Mappings;

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
            cfg.AddProfile<VehicleProfile>();
            cfg.AddProfile<AccessEventProfile>();
        });

        Mapper = config.CreateMapper();
    }

    public void Dispose() => GC.SuppressFinalize(this);
}

[CollectionDefinition("Mapper")]
public class MapperCollection : ICollectionFixture<MapperFixture>;