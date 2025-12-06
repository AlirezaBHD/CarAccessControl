using CarAccessControl.Application.Features.Cameras.Dtos;
using CarAccessControl.Application.Features.Cameras.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarAccessControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CamerasController(
        ICameraService cameraService)
        : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<CameraListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IReadOnlyList<CameraListDto>>> Get()
        {
            var cameras = await cameraService.GetListAsync();
            return Ok(cameras);
        }

        
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(CameraDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CameraDetailDto>> GetById(int id)
        {
            var camera = await cameraService.GetByIdAsync(id);
            return Ok(camera);
        }

        
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Create([FromBody] CameraUpsertDto cameraUpsertDto)
        {
            var id = await cameraService.CreateAsync(cameraUpsertDto);
            return CreatedAtAction(nameof(GetById), new { id }, cameraUpsertDto);
        }

        
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Update(int id, [FromBody] CameraUpsertDto updateDto)
        {
            await cameraService.UpdateAsync(id, updateDto);
            return NoContent();
        }

        
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
            await cameraService.DeleteAsync(id);
            return NoContent();
        }
    }
}