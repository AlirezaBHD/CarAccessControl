using AutoMapper;
using CarAccessControl.Application.Features.Cameras.Dtos;
using CarAccessControl.Application.Features.Cameras.Services;
using CarAccessControl.Application.Tests.Common.Fixtures;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAccessControl.Application.Tests.Features.Cameras.Services;

[Collection("Mapper")]
public class CameraServiceTests
{
    private readonly Mock<ICameraRepository> _repositoryMock;
    private readonly Mock<ILogger<Camera>> _loggerMock;
    private readonly IMapper _mapper;
    private readonly CameraService _sut;

    public CameraServiceTests(MapperFixture mapperFixture)
    {
        _repositoryMock = new Mock<ICameraRepository>();
        _loggerMock = new Mock<ILogger<Camera>>();
        _mapper = mapperFixture.Mapper;

        _sut = new CameraService(
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
            .Setup(r => r.AddAsync(It.IsAny<Camera>()))
            .Callback<Camera>(c => c.Id = expectedId)
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
            .Setup(r => r.AddAsync(It.IsAny<Camera>()))
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Camera>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldMapDtoToEntity()
    {
        // Arrange
        var dto = CreateValidDto();
        Camera? capturedEntity = null;

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Camera>()))
            .Callback<Camera>(c => capturedEntity = c)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        capturedEntity.Should().NotBeNull();
        capturedEntity!.Ip.Should().Be(dto.Ip);
        capturedEntity.Url.Should().Be(dto.Url);
        capturedEntity.FrameInterval.Should().Be(dto.FrameInterval);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateEntity()
    {
        // Arrange
        var id = 1;
        var existingEntity = CreateEntity(id);
        var dto = new CameraUpsertDto
        {
            Ip = "192.168.1.200",
            Url = "rtsp://192.168.1.200:554/stream",
            FrameInterval = 30
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(existingEntity);

        // Act
        await _sut.UpdateAsync(id, dto);

        // Assert
        _repositoryMock.Verify(r => r.Update(It.IsAny<Camera>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region GetListAsync

    [Fact]
    public async Task GetListAsync_WhenCamerasExist_ShouldReturnList()
    {
        // Arrange
        var expectedList = new List<CameraListDto>
        {
            new() { Id = 1, Ip = "192.168.1.100", Url = "rtsp://test", FrameInterval = 10 },
            new() { Id = 2, Ip = "192.168.1.101", Url = "rtsp://test2", FrameInterval = 12 }
        };

        _repositoryMock
            .Setup(r => r.ListProjectedAsync<CameraListDto>(It.IsAny<ISpecification<Camera>>()))
            .ReturnsAsync(expectedList);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedList);
    }

    [Fact]
    public async Task GetListAsync_WhenNoCameras_ShouldReturnEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.ListProjectedAsync<CameraListDto>(It.IsAny<ISpecification<Camera>>()))
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
        var expectedDto = new CameraDetailDto
        {
            Id = id,
            Ip = "192.168.1.100",
            Url = "rtsp://192.168.1.100:554/stream",
            FrameInterval = 10
        };

        _repositoryMock
            .Setup(r => r.GetByIdProjectedAsync<CameraDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
        result.Ip.Should().Be(expectedDto.Ip);
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

    private static CameraUpsertDto CreateValidDto() => new()
    {
        Ip = "192.168.1.100",
        Url = "rtsp://192.168.1.100:554/stream",
        FrameInterval = 15
    };

    private static Camera CreateEntity(int id) => new()
    {
        Id = id,
        Ip = "192.168.1.100",
        Url = "rtsp://192.168.1.100:554/stream",
        FrameInterval = 15
    };

    #endregion
}