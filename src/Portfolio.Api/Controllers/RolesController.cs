using Portfolio.Api.DTOs.Roles;
using Portfolio.Api.Services.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Api.Controllers
{
    [Route("api/roluri")]
    [ApiController]
    [Authorize(Roles = "SUPERADMIN")]
    public class RolesController(IRolesService rolesService) : ControllerBase
    {
        private readonly IRolesService _rolesService = rolesService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRoles()
        {
            var roles = await _rolesService.GetAllRolesAsync();
            return StatusCode(StatusCodes.Status200OK, roles);
        }

        [HttpPost]
        public async Task<ActionResult> PostRole([FromBody] RoleDTO roleDTO)
        {
            await _rolesService.PostRoleAsync(roleDTO);
            return StatusCode(StatusCodes.Status201Created, new { Message = "Rol adăugat cu succes", MessageKey = "api.roleAdded" });

        }

        [HttpPut]
        public async Task<ActionResult> PutRole([FromBody] RoleDTO roleDTO)
        {
            await _rolesService.PutRoleAsync(roleDTO);
            return StatusCode(StatusCodes.Status200OK, new { Message = "Rol actualizat cu succes", MessageKey = "api.roleUpdated" });
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteRole([FromQuery] long id)
        {
            await _rolesService.DeleteRoleAsync(id);
            return StatusCode(StatusCodes.Status200OK, new { Message = "Rol șters cu succes", MessageKey = "api.roleDeleted" });
        }
    }
}
