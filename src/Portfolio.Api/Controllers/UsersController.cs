using Portfolio.Api.DTOs.User;
using Portfolio.Api.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Api.Controllers
{
    [Route("api/utilizatori")]
    [ApiController]
    [Authorize(Roles = "SUPERADMIN")]
    public class UsersController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGetDTO>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult> AddUser(UserPostDTO userPostDTO)
        {

            await _userService.UserPost(userPostDTO);
            return StatusCode(StatusCodes.Status200OK, new { Message = "Utilizator adăugat cu succes", MessageKey = "api.userAdded" });
        }

        [HttpPut]
        public async Task<ActionResult> ModifyUsersRoles(UserPutDTO userPutDTO)
        {
            await _userService.UserPut(userPutDTO);
            return StatusCode(StatusCodes.Status200OK, new { Message = "Utilizator modificat cu succes", MessageKey = "api.userUpdated" });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            await _userService.UserDelete(id);
            return StatusCode(StatusCodes.Status200OK, new { Message = "Utilizator șters cu succes", MessageKey = "api.userDeleted" });
        }
    }
}
