using CarAccessControl.Application.Features.AccessEvents.Dtos;
using CarAccessControl.Application.Features.AccessEvents.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarAccessControl.API.Controllers;
    [ApiController]
    [Route("api/[controller]")]
    public class AccessEventsController(
        IAccessEventService accessEventService)
        : ControllerBase
    {

        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<EventListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IReadOnlyList<EventListDto>>> Get()
        {
            var cameras = await accessEventService.GetListAsync();
            return Ok(cameras);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(EventDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EventDetailDto>> GetById(int id)
        {
            var camera = await accessEventService.GetByIdAsync(id);

            return Ok(camera);
        }
        
        [HttpGet("report")]
        [ProducesResponseType(typeof(byte[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EventReportRequestDto>> GetReport([FromQuery] EventReportRequestDto requestDto)
        {
            var excelData = await accessEventService.CreateReportAsync(requestDto);
            var fileName = $"ParkingAccessReport_{DateTime.UtcNow:yyyyMMdd_HHmmss}.xlsx";

            return File(excelData,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                fileName);
        }
        
        [HttpPatch("{id:int}")]
        [ProducesResponseType( StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EventDetailDto>> CompleteEvent(int id, [FromBody] CompleteEventDto dto)
        {
            await accessEventService.CompleteAccessEventAsync(id, dto);

            return NoContent();
        }
        
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
                await accessEventService.DeleteEvent(id);
                return NoContent();
        }
}