using AutoMapper;
using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Application.Features.Gates.Services;
using CarAccessControl.Application.Tests.Common.Fixtures;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAccessControl.Application.Tests.Features.Gates.Services;

[Collection("Mapper")]
public class GateServiceTests
{
    private readonly Mock<IGateRepository> _repositoryMock;
    private readonly Mock<ILogger<Gate>> _loggerMock;
    private readonly IMapper _mapper;
    private readonly GateService _sut;

    public GateServiceTests(MapperFixture mapperFixture)
    {
        _repositoryMock = new Mock<IGateRepository>();
        _loggerMock = new Mock<ILogger<Gate>>();
        _mapper = mapperFixture.Mapper;

        _sut = new GateService(
            _mapper,
            _repositoryMock.Object,
            _loggerMock.Object);
    }

    #region CreateAsync

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldReturnNewEntityId()
    {
        // Arrange
        var dto = CreateValidDto();
        var expectedId = 1;

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Gate>()))
            .Callback<Gate>(g => g.Id = expectedId)
            .Returns(Task.CompletedTask);

        _repositoryMock
            .Setup(r => r.SaveAsync())
            .Returns(Task.CompletedTask);

        // Act
        var result = await _sut.CreateAsync(dto);

        // Assert
        result.Should().Be(expectedId);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldCallRepositoryAddAndSave()
    {
        // Arrange
        var dto = CreateValidDto();

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Gate>()))
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Gate>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldMapDtoToEntity()
    {
        // Arrange
        var dto = CreateValidDto();
        Gate? capturedEntity = null;

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Gate>()))
            .Callback<Gate>(g => capturedEntity = g)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        capturedEntity.Should().NotBeNull();
        capturedEntity!.Name.Should().Be(dto.Name);
        capturedEntity.Location.Should().Be(dto.Location);
        capturedEntity.CameraId.Should().Be(dto.CameraId);
        capturedEntity.IsActive.Should().Be(dto.IsActive);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateEntity()
    {
        // Arrange
        var id = 1;
        var existingEntity = CreateEntity(id);
        var dto = new GateUpsertDto
        {
            Name = "Updated Gate",
            Location = "Updated Location",
            CameraId = 2,
            IsActive = false
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(existingEntity);

        // Act
        await _sut.UpdateAsync(id, dto);

        // Assert
        _repositoryMock.Verify(r => r.Update(It.IsAny<Gate>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region GetListAsync

    [Fact]
    public async Task GetListAsync_WhenGatesExist_ShouldReturnList()
    {
        // Arrange
        var expectedList = new List<GateListDto>
        {
            new()
            {
                Id = 1,
                Name = "Main Entrance",
                Location = "Main Door",
                CameraIp = "192.168.1.101"
            },
            new()
            {
                Id = 2,
                Name = "Back Gate",
                Location = "Server Room",
                CameraIp = "192.168.1.102"
            }
        };

        _repositoryMock
            .Setup(r => r.ListProjectedAsync<GateListDto>(It.IsAny<ISpecification<Gate>>()))
            .ReturnsAsync(expectedList);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedList);
    }

    [Fact]
    public async Task GetListAsync_WhenNoGates_ShouldReturnEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.ListProjectedAsync<GateListDto>(It.IsAny<ISpecification<Gate>>()))
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
        var expectedDto = new GateDetailDto
        {
            Id = id,
            Name = "Main Entrance",
            Location = "Building A",
            CameraId = 1,
            IsActive = true,
            CameraIp = "192.168.1.101"
        };

        _repositoryMock
            .Setup(r => r.GetByIdProjectedAsync<GateDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
        result.Name.Should().Be(expectedDto.Name);
    }

    #endregion

    #region DeleteAsync

    [Fact]
    public async Task DeleteAsync_WithValidId_ShouldRemoveEntity()
    {
        // Arrange
        var id = 1;
        var entity = CreateEntity(id);

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(entity);

        // Act
        await _sut.DeleteAsync(id);

        // Assert
        _repositoryMock.Verify(r => r.Remove(entity), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region Helper Methods

    private static GateUpsertDto CreateValidDto() => new()
    {
        Name = "Main Entrance",
        Location = "Building A - North Side",
        CameraId = 1,
        IsActive = true
    };

    private static Gate CreateEntity(int id) => new()
    {
        Id = id,
        Name = "Main Entrance",
        Location = "Building A - North Side",
        CameraId = 1,
        IsActive = true,
        Camera = new Camera
        {
            Id = 1,
            Ip = "192.168.1.100",
            Url = "rtsp://192.168.1.100:554/stream"
        }
    };

    #endregion
}