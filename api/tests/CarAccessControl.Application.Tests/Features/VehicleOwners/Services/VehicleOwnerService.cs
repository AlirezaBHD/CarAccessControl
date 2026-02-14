using AutoMapper;
using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Application.Features.VehicleOwners.Services;
using CarAccessControl.Application.Tests.Common.Fixtures;
using CarAccessControl.Domain.Entities;
using CarAccessControl.Domain.Interfaces;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;

namespace CarAccessControl.Application.Tests.Features.VehicleOwners.Services;

[Collection("Mapper")]
public class VehicleOwnerServiceTests
{
    private readonly Mock<IVehicleOwnerRepository> _repositoryMock;
    private readonly Mock<ILogger<VehicleOwner>> _loggerMock;
    private readonly IMapper _mapper;
    private readonly VehicleOwnerService _sut;

    public VehicleOwnerServiceTests(MapperFixture mapperFixture)
    {
        _repositoryMock = new Mock<IVehicleOwnerRepository>();
        _loggerMock = new Mock<ILogger<VehicleOwner>>();
        _mapper = mapperFixture.Mapper;

        _sut = new VehicleOwnerService(
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
            .Setup(r => r.AddAsync(It.IsAny<VehicleOwner>()))
            .Callback<VehicleOwner>(v => v.Id = expectedId)
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
            .Setup(r => r.AddAsync(It.IsAny<VehicleOwner>()))
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<VehicleOwner>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldMapDtoToEntity()
    {
        // Arrange
        var dto = CreateValidDto();
        VehicleOwner? capturedEntity = null;

        _repositoryMock
            .Setup(r => r.AddAsync(It.IsAny<VehicleOwner>()))
            .Callback<VehicleOwner>(v => capturedEntity = v)
            .Returns(Task.CompletedTask);

        // Act
        await _sut.CreateAsync(dto);

        // Assert
        capturedEntity.Should().NotBeNull();
        capturedEntity!.FirstName.Should().Be(dto.FirstName);
        capturedEntity.Surname.Should().Be(dto.Surname);
        capturedEntity.NationalCode.Should().Be(dto.NationalCode);
    }

    #endregion

    #region UpdateAsync

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateEntity()
    {
        // Arrange
        var id = 1;
        var existingEntity = CreateEntity(id);
        var dto = new VehicleOwnerUpsertDto
        {
            FirstName = "Updated",
            Surname = "Owner",
            NationalCode = "0987654321"
        };

        _repositoryMock
            .Setup(r => r.GetByIdAsync(id))
            .ReturnsAsync(existingEntity);

        // Act
        await _sut.UpdateAsync(id, dto);

        // Assert
        _repositoryMock.Verify(r => r.Update(It.IsAny<VehicleOwner>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveAsync(), Times.Once);
    }

    #endregion

    #region GetListAsync

    [Fact]
    public async Task GetListAsync_WhenOwnersExist_ShouldReturnList()
    {
        // Arrange
        var expectedList = new List<VehicleOwnerListDto>
        {
            new()
            {
                Id = 1,
                FirstName = "Jack",
                Surname = "Sky",
                NationalCode = "1234567890",
                VehiclesCount = 2
            },
            new()
            {
                Id = 2,
                FirstName = "Reza",
                Surname = "Hosseini",
                NationalCode = "0987654321",
                VehiclesCount = 1
            }
        };

        _repositoryMock
            .Setup(r => r.ListProjectedAsync<VehicleOwnerListDto>(It.IsAny<ISpecification<VehicleOwner>>()))
            .ReturnsAsync(expectedList);

        // Act
        var result = await _sut.GetListAsync();

        // Assert
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expectedList);
    }

    [Fact]
    public async Task GetListAsync_WhenNoOwners_ShouldReturnEmptyList()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.ListProjectedAsync<VehicleOwnerListDto>(It.IsAny<ISpecification<VehicleOwner>>()))
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
        var expectedDto = new VehicleOwnerDetailDto
        {
            Id = id,
            FirstName = "Jack",
            Surname = "Sky",
            NationalCode = "1234567890"
        };

        _repositoryMock
            .Setup(r => r.GetByIdProjectedAsync<VehicleOwnerDetailDto>(id))
            .ReturnsAsync(expectedDto);

        // Act
        var result = await _sut.GetByIdAsync(id);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(id);
        result.FirstName.Should().Be(expectedDto.FirstName);
        result.Surname.Should().Be(expectedDto.Surname);
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

    private static VehicleOwnerUpsertDto CreateValidDto() => new()
    {
        FirstName = "Jack",
        Surname = "Sky",
        NationalCode = "1234567890"
    };

    private static VehicleOwner CreateEntity(int id) => new()
    {
        Id = id,
        FirstName = "Jack",
        Surname = "Sky",
        NationalCode = "1234567890"
    };

    #endregion
}