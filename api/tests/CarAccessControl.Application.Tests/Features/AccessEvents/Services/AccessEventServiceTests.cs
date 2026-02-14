using AutoMapper;
using CarAccessControl.Application.Common.Exceptions;
using CarAccessControl.Application.Common.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Dtos;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using CarAccessControl.Application.Features.AccessEvents.Services;
using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Application.Tests.Common.Fixtures;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAccessControl.Application.Tests.Features.AccessEvents.Services;

[Collection("Mapper")]
public class AccessEventServiceTests
{
    private readonly Mock<IAccessEventRepository> _accessEventRepositoryMock;
    private readonly Mock<IGateRepository> _gateRepositoryMock;
    private readonly Mock<IVehicleRepository> _vehicleRepositoryMock;
    private readonly Mock<ILogger<AccessEvent>> _loggerMock;
    private readonly Mock<IExcelReportService> _excelReportServiceMock;
    private readonly Mock<IAccessEventNotificationService> _notificationServiceMock;
    private readonly Mock<ILicensePlateService> _licensePlateServiceMock;
    private readonly Mock<IStorageService> _storageServiceMock;
    private readonly IMapper _mapper;
    private readonly AccessEventService _sut;

    public AccessEventServiceTests(MapperFixture mapperFixture)
    {
        _accessEventRepositoryMock = new Mock<IAccessEventRepository>();
        _gateRepositoryMock = new Mock<IGateRepository>();
        _vehicleRepositoryMock = new Mock<IVehicleRepository>();
        _loggerMock = new Mock<ILogger<AccessEvent>>();
        _excelReportServiceMock = new Mock<IExcelReportService>();
        _notificationServiceMock = new Mock<IAccessEventNotificationService>();
        _licensePlateServiceMock = new Mock<ILicensePlateService>();
        _storageServiceMock = new Mock<IStorageService>();
        _mapper = mapperFixture.Mapper;

        _sut = new AccessEventService(
            _mapper,
            _accessEventRepositoryMock.Object,
            _gateRepositoryMock.Object,
            _vehicleRepositoryMock.Object,
            _loggerMock.Object,
            _excelReportServiceMock.Object,
            _notificationServiceMock.Object,
            _licensePlateServiceMock.Object,
            _storageServiceMock.Object);
    }

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_WithDuplicatePlate_ShouldReturnEarly()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });

        _licensePlateServiceMock
            .Setup(s => s.IsDuplicate(plate))
            .Returns(true);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        _accessEventRepositoryMock.Verify(r => r.AddAsync(It.IsAny<AccessEvent>()), Times.Never);
        _licensePlateServiceMock.Verify(s => s.AddPlate(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_WithValidData_ShouldAddPlateToService()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });

        SetupValidCreateScenario(cameraId, plate);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        _licensePlateServiceMock.Verify(s => s.AddPlate(plate), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WhenGateNotFound_ShouldThrowValidationException()
    {
        // Arrange
        var cameraId = 999;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });

        _licensePlateServiceMock.Setup(s => s.IsDuplicate(plate)).Returns(false);
        _gateRepositoryMock
            .Setup(r => r.GetProjectedAsync<GateDto>(It.IsAny<ISpecification<Gate>>()))
            .ReturnsAsync((GateDto)null!);

        // Act
        var act = () => _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        await act.Should().ThrowAsync<ValidationException>()
            .WithMessage($"*{cameraId}*");
    }

    [Fact]
    public async Task CreateAsync_WithValidData_ShouldSaveImage()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var imageBytes = new byte[] { 1, 2, 3 };
        var frameBase64 = Convert.ToBase64String(imageBytes);

        SetupValidCreateScenario(cameraId, plate);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        _storageServiceMock.Verify(
            s => s.SaveFileAsync(
                It.Is<string>(f => f.StartsWith($"{cameraId}_")),
                It.Is<byte[]>(b => b.SequenceEqual(imageBytes)),
                "plates"),
            Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithValidData_ShouldCreateAccessEvent()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });
        AccessEvent? capturedEvent = null;

        SetupValidCreateScenario(cameraId, plate);

        _accessEventRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<AccessEvent>()))
            .Callback<AccessEvent>(e => capturedEvent = e)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        capturedEvent.Should().NotBeNull();
        capturedEvent!.PlateNumber.Should().Be(plate);
        capturedEvent.CameraId.Should().Be(cameraId);
        capturedEvent.IsAllowed.Should().BeTrue();
    }

    [Fact]
    public async Task CreateAsync_WithRegisteredVehicle_ShouldIncludeOwnerInfo()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });
        AccessEvent? capturedEvent = null;

        var vehicleDto = new VehicleDto
        {
            Id = 1,
            Name = "Peugeot 405",
            OwnerId = 1,
            OwnerFirstName = "Jack",
            OwnerSurname = "Sky"
        };

        SetupValidCreateScenario(cameraId, plate, vehicleDto);

        _accessEventRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<AccessEvent>()))
            .Callback<AccessEvent>(e => capturedEvent = e)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        capturedEvent!.VehicleId.Should().Be(vehicleDto.Id);
        capturedEvent.VehicleName.Should().Be(vehicleDto.Name);
        capturedEvent.OwnerId.Should().Be(vehicleDto.OwnerId);
        capturedEvent.OwnerFirstName.Should().Be(vehicleDto.OwnerFirstName);
        capturedEvent.OwnerSurname.Should().Be(vehicleDto.OwnerSurname);
    }

    [Fact]
    public async Task CreateAsync_WithUnregisteredVehicle_ShouldHaveNullOwnerInfo()
    {
        // Arrange
        var cameraId = 1;
        var plate = "99ج999-99";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });
        AccessEvent? capturedEvent = null;

        SetupValidCreateScenario(cameraId, plate, null);

        _accessEventRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<AccessEvent>()))
            .Callback<AccessEvent>(e => capturedEvent = e)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        capturedEvent!.VehicleId.Should().BeNull();
        capturedEvent.OwnerId.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_WithValidData_ShouldNotifyClients()
    {
        // Arrange
        var cameraId = 1;
        var plate = "12الف345-67";
        var frameBase64 = Convert.ToBase64String(new byte[] { 1, 2, 3 });

        SetupValidCreateScenario(cameraId, plate);

        // Act
        await _sut.CreateAsync(cameraId, plate, frameBase64);

        // Assert
        _notificationServiceMock.Verify(
            s => s.NotifyNewAccessEvent(It.IsAny<RealTimeEventDto>()),
            Times.Once);
    }

    #endregion

    #region GetListAsync

    [Fact]
    public async Task GetListAsync_WhenEventsExist_ShouldReturnList()
    {
        // Arrange
        var expectedList = new List<EventListDto>
        {
            CreateEventListDto(1, "12الف345-67"),
            CreateEventListDto(2, "98ب765-43")
        };

        _accessEventRepositoryMock
            .Setup(r => r.ListProjectedAsync<EventListDto>(It.IsAny<ISpecification<AccessEvent>>()))
            .ReturnsAsync(expectedList);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedList);
    }

    [Fact]
    public async Task GetListAsync_WhenNoEvents_ShouldReturnEmptyList()
    {
        // Arrange
        _accessEventRepositoryMock
            .Setup(r => r.ListProjectedAsync<EventListDto>(It.IsAny<ISpecification<AccessEvent>>()))
            .ReturnsAsync([]);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().BeEmpty();
    }

    #endregion

    #region GetByIdAsync

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnDto()
    {
        // Arrange
        var id = 1;
        var expectedDto = CreateEventDetailDto(id);

        _accessEventRepositoryMock
            .Setup(r => r.GetByIdProjectedAsync<EventDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
    }

    #endregion

    #region CreateReportAsync

    [Fact]
    public async Task CreateReportAsync_WithValidRequest_ShouldReturnExcelBytes()
    {
        // Arrange
        var request = new EventReportRequestDto
        {
            FromDate = DateTime.Today.AddDays(-7),
            ToDate = DateTime.Today
        };
        var expectedBytes = new byte[] { 1, 2, 3, 4, 5 };

        _accessEventRepositoryMock
            .Setup(r => r.ListProjectedAsync<EventListDto>(It.IsAny<ISpecification<AccessEvent>>()))
            .ReturnsAsync(new List<EventListDto>());

        _excelReportServiceMock
            .Setup(s => s.GenerateAccessEventReportAsync(
                It.IsAny<List<EventListDto>>(),
                request.FromDate,
                request.ToDate))
            .ReturnsAsync(expectedBytes);

        // Act
        var result = await _sut.CreateReportAsync(request);

        // Assert
        result.Should().BeEquivalentTo(expectedBytes);
    }

    [Fact]
    public async Task CreateReportAsync_WithFilters_ShouldPassFiltersToSpecification()
    {
        // Arrange
        var request = new EventReportRequestDto
        {
            FromDate = DateTime.Today.AddDays(-7),
            ToDate = DateTime.Today,
            OwnerId = 1,
            VehicleId = 2
        };

        _accessEventRepositoryMock
            .Setup(r => r.ListProjectedAsync<EventListDto>(It.IsAny<ISpecification<AccessEvent>>()))
            .ReturnsAsync(new List<EventListDto>());

        _excelReportServiceMock
            .Setup(s => s.GenerateAccessEventReportAsync(
                It.IsAny<List<EventListDto>>(),
                It.IsAny<DateTime>(),
                It.IsAny<DateTime>()))
            .ReturnsAsync(Array.Empty<byte>());

        // Act
        await _sut.CreateReportAsync(request);

        // Assert
        _accessEventRepositoryMock.Verify(
            r => r.ListProjectedAsync<EventListDto>(It.IsAny<ISpecification<AccessEvent>>()),
            Times.Once);
    }

    #endregion

    #region CompleteAccessEventAsync

    [Fact]
    public async Task CompleteAccessEventAsync_WithValidData_ShouldUpdateEntity()
    {
        // Arrange
        var id = 1;
        var entity = CreateAccessEventEntity(id);
        var dto = new CompleteEventDto
        {
            VehicleName = "Updated Vehicle",
            OwnerFirstName = "Updated",
            OwnerSurname = "Owner",
            Enter = false
        };

        _accessEventRepositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(entity);

        // Act
        await _sut.CompleteAccessEventAsync(id, dto);

        // Assert
        _accessEventRepositoryMock.Verify(r => r.Update(It.IsAny<AccessEvent>()), Times.Once);
        _accessEventRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region DeleteEvent

    [Fact]
    public async Task DeleteEvent_WithValidId_ShouldRemoveEntity()
    {
        // Arrange
        var id = 1;
        var entity = CreateAccessEventEntity(id);

        _accessEventRepositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(entity);

        // Act
        await _sut.DeleteEvent(id);

        // Assert
        _accessEventRepositoryMock.Verify(r => r.Remove(entity), Times.Once);
        _accessEventRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteEvent_WhenEntityNotFound_ShouldThrowException()
    {
        // Arrange
        var id = 999;

        _accessEventRepositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync((AccessEvent)null!);

        _accessEventRepositoryMock
            .Setup(r => r.Remove(null!))
            .Throws<ArgumentNullException>();

        // Act
        var act = () => _sut.DeleteEvent(id);

        // Assert
        await act.Should().ThrowAsync<ArgumentNullException>();
    }

    #endregion

    #region Helper Methods

    private void SetupValidCreateScenario(int cameraId, string plate, VehicleDto? vehicle = null)
    {
        _licensePlateServiceMock
            .Setup(s => s.IsDuplicate(plate))
            .Returns(false);

        _vehicleRepositoryMock
            .Setup(r => r.GetProjectedAsync<VehicleDto>(It.IsAny<ISpecification<Vehicle>>()))
            .ReturnsAsync(vehicle);

        _gateRepositoryMock
            .Setup(r => r.GetProjectedAsync<GateDto>(It.IsAny<ISpecification<Gate>>()))
            .ReturnsAsync(new GateDto
            {
                Id = 1,
                Name = "Main Gate",
                CameraIp = "192.168.1.100"
            });

        _storageServiceMock
            .Setup(s => s.SaveFileAsync(It.IsAny<string>(), It.IsAny<byte[]>(), It.IsAny<string>()))
            .ReturnsAsync("/plates/test.jpg");

        _accessEventRepositoryMock
            .Setup(r => r.AddAsync(It.IsAny<AccessEvent>()))
            .Returns(Task.CompletedTask);

        _accessEventRepositoryMock
            .Setup(r => r.SaveAsync())
            .Returns(Task.CompletedTask);

        _notificationServiceMock
            .Setup(s => s.NotifyNewAccessEvent(It.IsAny<RealTimeEventDto>()))
            .Returns(Task.CompletedTask);
    }

    private static EventListDto CreateEventListDto(int id, string plate) => new()
    {
        Id = id,
        PlateNumber = plate,
        VehicleName = "Peugeot 405",
        OwnerFirstName = "Jack",
        OwnerSurname = "Sky",
        GateName = "Main Gate",
        IsAllowed = true,
        Enter = true,
        CreatedOn = DateTime.UtcNow
    };

    private static EventDetailDto CreateEventDetailDto(int id) => new()
    {
        Id = id,
        PlateNumber = "12الف345-67",
        ImagePath = "/plates/test.jpg",
        VehicleName = "Peugeot 405",
        VehicleId = 1,
        OwnerFirstName = "Jack",
        OwnerSurname = "Sky",
        OwnerId = 1,
        GateName = "Main Gate",
        GateId = 1,
        CameraIp = "192.168.1.100",
        CameraId = 1,
        IsAllowed = true,
        CreatedOn = DateTime.UtcNow
    };

    private static AccessEvent CreateAccessEventEntity(int id) => new()
    {
        Id = id,
        PlateNumber = "12الف345-67",
        ImagePath = "/plates/test.jpg",
        CameraId = 1,
        CameraIp = "192.168.1.100",
        GateId = 1,
        GateName = "Main Gate",
        IsAllowed = true
    };

    #endregion
}