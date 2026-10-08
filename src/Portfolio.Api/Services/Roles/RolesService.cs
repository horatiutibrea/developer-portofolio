using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Roles;
using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Services.Roles;

public class RolesService(DataContext dataContext) : IRolesService
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<IEnumerable<RoleDTO>> GetAllRolesAsync() =>
        await _dataContext.Roles.AsNoTracking().OrderBy(role => role.Priority)
            .Select(role => new RoleDTO
            { Id = role.Id, Name = role.Name, IsActive = role.IsActive, Priority = role.Priority }).ToListAsync();

    public async Task PostRoleAsync(RoleDTO dto)
    {
        _dataContext.Roles.Add(new Role
        { Name = dto.Name.Trim().ToUpperInvariant(), IsActive = dto.IsActive, Priority = dto.Priority });
        await _dataContext.SaveChangesAsync();
    }

    public async Task PutRoleAsync(RoleDTO dto)
    {
        var role = await _dataContext.Roles.SingleOrDefaultAsync(item => item.Id == dto.Id)
            ?? throw new KeyNotFoundException("Rolul nu a fost găsit.");
        role.Name = dto.Name.Trim().ToUpperInvariant();
        role.IsActive = dto.IsActive;
        role.Priority = dto.Priority;
        await _dataContext.SaveChangesAsync();
    }

    public async Task DeleteRoleAsync(long id)
    {
        var role = await _dataContext.Roles.SingleOrDefaultAsync(item => item.Id == id)
            ?? throw new KeyNotFoundException("Rolul nu a fost găsit.");
        _dataContext.Roles.Remove(role);
        await _dataContext.SaveChangesAsync();
    }
}
