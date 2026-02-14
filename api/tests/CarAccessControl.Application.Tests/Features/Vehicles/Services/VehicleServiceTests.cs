using AutoMapper;
using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Application.Features.Vehicles.Services;
using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Application.Tests.Common.Fixtures;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAccessControl.Application.Tests.Features.Vehicles.Services;

[Collection("Mapper")]
public class VehicleServiceTests
{
    private readonly Mock<IVehicleRepository> _repositoryMock;
    private readonly Mock<ILogger<Vehicle>> _loggerMock;
    private readonly IMapper _mapper;
    private readonly VehicleService _sut;

    public VehicleServiceTests(MapperFixture mapperFixture)
    {
        _repositoryMock = new Mock<IVehicleRepository>();
        _loggerMock = new Mock<ILogger<Vehicle>>();
        _mapper = mapperFixture.Mapper;

        _sut = new VehicleService(
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
            .Setup(r => r.AddAsync(It.IsAny<Vehicle>()))
            .Callback<Vehicle>(v => v.Id = expectedId)
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
            .Setup(r => r.AddAsync(It.IsAny<Vehicle>()))
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Vehicle>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldMapDtoToEntity()
    {
        // Arrange
        var dto = CreateValidDto();
        Vehicle? capturedEntity = null;

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<Vehicle>()))
            .Callback<Vehicle>(v => capturedEntity = v)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        capturedEntity.Should().NotBeNull();
        capturedEntity!.Name.Should().Be(dto.Name);
        capturedEntity.PlateNumber.Should().Be(dto.PlateNumber);
        capturedEntity.OwnerId.Should().Be(dto.OwnerId);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateEntity()
    {
        // Arrange
        var id = 1;
        var existingEntity = CreateEntity(id);
        var dto = new VehicleUpsertDto
        {
            Name = "Updated Peugeot 206",
            PlateNumber = "98ب765-43",
            OwnerId = 2
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(existingEntity);

        // Act
        await _sut.UpdateAsync(id, dto);

        // Assert
        _repositoryMock.Verify(r => r.Update(It.IsAny<Vehicle>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region GetListAsync

    [Fact]
    public async Task GetListAsync_WhenVehiclesExist_ShouldReturnList()
    {
        // Arrange
        var expectedList = new List<VehicleListDto>
        {
            new()
            {
                Id = 1,
                Name = "Peugeot 405",
                PlateNumber = "12الف345-67",
                OwnerFullName = "Jack Sky"
            },
            new()
            {
                Id = 2,
                Name = "Samand LX",
                PlateNumber = "98ب765-43",
                OwnerFullName = "Reza Hosseini"
            }
        };

        _repositoryMock
            .Setup(r => r.ListProjectedAsync<VehicleListDto>(It.IsAny<ISpecification<Vehicle>>()))
            .ReturnsAsync(expectedList);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedList);
    }

    [Fact]
    public async Task GetListAsync_WhenNoVehicles_ShouldReturnEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.ListProjectedAsync<VehicleListDto>(It.IsAny<ISpecification<Vehicle>>()))
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
        var expectedDto = new VehicleDetailDto
        {
            Id = id,
            Name = "Peugeot 405",
            PlateNumber = "12الف345-67",
            OwnerId = 1,
            OwnerDetail = new VehicleOwnerDetailDto
            {
                Id = 1,
                FirstName = "Jack",
                Surname = "Sky",
                NationalCode = "1234567890"
            }
        };

        _repositoryMock
            .Setup(r => r.GetByIdProjectedAsync<VehicleDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
        result.Name.Should().Be(expectedDto.Name);
        result.PlateNumber.Should().Be(expectedDto.PlateNumber);
        result.OwnerDetail.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnOwnerDetails()
    {
        // Arrange
        var id = 1;
        var expectedDto = new VehicleDetailDto
        {
            Id = id,
            Name = "Peugeot 405",
            PlateNumber = "12الف345-67",
            OwnerId = 1,
            OwnerDetail = new VehicleOwnerDetailDto
            {
                Id = 1,
                FirstName = "Jack",
                Surname = "Sky",
                NationalCode = "1234567890"
            }
        };

        _repositoryMock
            .Setup(r => r.GetByIdProjectedAsync<VehicleDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.OwnerDetail.FirstName.Should().Be("Jack");
        result.OwnerDetail.Surname.Should().Be("Sky");
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

    private static VehicleUpsertDto CreateValidDto() => new()
    {
        Name = "Peugeot 405",
        PlateNumber = "12الف345-67",
        OwnerId = 1
    };

    private static Vehicle CreateEntity(int id) => new()
    {
        Id = id,
        Name = "Peugeot 405",
        PlateNumber = "12الف345-67",
        OwnerId = 1,
        Owner = new VehicleOwner
        {
            Id = 1,
            FirstName = "Jack",
            Surname = "Sky",
            NationalCode = "1234567890"
        }
    };

    #endregion
}