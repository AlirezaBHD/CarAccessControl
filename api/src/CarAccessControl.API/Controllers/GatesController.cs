using CarAccessControl.Application.Features.Gates.Dtos;
using CarAccessControl.Application.Features.Gates.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CarAccessControl.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GatesController(IGateService gateService) : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<GateListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IReadOnlyList<GateListDto>>> Get()
        {
            var gates = await gateService.GetListAsync();
            return Ok(gates);
        }
        
        
        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(GateDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<GateDetailDto>> GetById(int id)
        {
            var gate = await gateService.GetByIdAsync(id);

            return Ok(gate);
        }
        
        
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Create([FromBody] GateUpsertDto upsertDto)
        {
            var id = await gateService.CreateAsync(upsertDto);

            return CreatedAtAction(nameof(GetById), new { id }, upsertDto);
        }
        
        
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Update(int id, [FromBody] GateUpsertDto updateUpsertDto)
        {
            await gateService.UpdateAsync(id, updateUpsertDto);

            return NoContent();
        }
        
        
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> Delete(int id)
        {
            await gateService.DeleteAsync(id);
            
            return NoContent();
        }
    }
}