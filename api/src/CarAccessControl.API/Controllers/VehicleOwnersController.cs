using CarAccessControl.Application.Features.VehicleOwners.Dtos;
using CarAccessControl.Application.Features.VehicleOwners.Interfaces;
using CarAccessControl.Application.Features.VehicleOwners.Validations;
using Microsoft.AspNetCore.Mvc;

namespace CarAccessControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleOwnersController(
    IVehicleOwnerService vehicleOwnerService)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<VehicleOwnerListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IReadOnlyList<VehicleOwnerDetailDto>>> GetAll()
    {
        var vehicleOwners = await vehicleOwnerService.GetListAsync();
        return Ok(vehicleOwners);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(VehicleOwnerDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<VehicleOwnerDetailDto>> GetById(int id)
    {
        var vehicleOwner = await vehicleOwnerService.GetByIdAsync(id);

        return Ok(vehicleOwner);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create([FromBody] VehicleOwnerUpsertDto upsertDto)
    {
        var id = await vehicleOwnerService.CreateAsync(upsertDto);
        return CreatedAtAction(nameof(GetById), new { id }, upsertDto);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, [FromBody] VehicleOwnerUpsertDto updateUpsertDto)
    {
        await vehicleOwnerService.UpdateAsync(id, updateUpsertDto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Delete(int id)
    {
        await vehicleOwnerService.DeleteAsync(id);
        return NoContent();
    }
}