using Portfolio.Api.DTOs.Roles;

namespace Portfolio.Api.Services.Roles
{
    public interface IRolesService
    {
        public Task<IEnumerable<RoleDTO>> GetAllRolesAsync();
        public Task PostRoleAsync(RoleDTO roleDTO);
        public Task PutRoleAsync(RoleDTO roleDTO);
        public Task DeleteRoleAsync(long id);
    }
}
