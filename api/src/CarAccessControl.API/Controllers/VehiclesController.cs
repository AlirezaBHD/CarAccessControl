using CarAccessControl.Application.Features.Vehicles.Dtos;
using CarAccessControl.Application.Features.Vehicles.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarAccessControl.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController(
    IVehicleService vehicleService)
    : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<VehicleListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IReadOnlyList<VehicleListDto>>> Get()
    {
        var vehicles = await vehicleService.GetListAsync();
        return Ok(vehicles);
    }


    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(VehicleDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<VehicleDetailDto>> GetById(int id)
    {
        var vehicle = await vehicleService.GetByIdAsync(id);
        return Ok(vehicle);
    }


    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Create([FromBody] VehicleUpsertDto upsertDto)
    {
        var id = await vehicleService.CreateAsync(upsertDto);
        return CreatedAtAction(nameof(GetById), new { id }, upsertDto);
    }


    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Update(int id, [FromBody] VehicleUpsertDto updateUpsertDto)
    {
        await vehicleService.UpdateAsync(id, updateUpsertDto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult> Delete(int id)
    {
        await vehicleService.DeleteAsync(id);
        return NoContent();
    }
}