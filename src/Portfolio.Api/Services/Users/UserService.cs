using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Roles;
using Portfolio.Api.DTOs.User;
using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Services.Users;

public class UserService(DataContext dataContext) : IUserService
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<IEnumerable<UserGetDTO>> GetAllUsersAsync() =>
        await _dataContext.Users.AsNoTracking().Include(user => user.Roles)
            .Select(user => new UserGetDTO
            {
                Id = user.Id, Email = user.Email, LastName = user.LastName, FirstName = user.FirstName,
                Roles = user.Roles.Select(role => new RoleDTO
                { Id = role.Id, Name = role.Name, IsActive = role.IsActive, Priority = role.Priority }).ToList(),
                IsLocked = user.IsLocked, LastLoginAt = user.LastLoginAt
            }).ToListAsync();

    public async Task UserPost(UserPostDTO dto)
    {
        var user = new User
        {
            Email = dto.Email, FirstName = string.Empty, LastName = string.Empty,
            SecurityStamp = Guid.NewGuid(), IsLocked = false
        };
        user.UserRoles = dto.RoleIds.Distinct()
            .Select(roleId => new UserRole { User = user, RoleId = roleId }).ToList();
        _dataContext.Users.Add(user);
        await _dataContext.SaveChangesAsync();
    }

    public async Task UserPut(UserPutDTO dto)
    {
        var user = await _dataContext.Users.Include(item => item.UserRoles)
            .SingleOrDefaultAsync(item => item.Id == dto.Id)
            ?? throw new KeyNotFoundException("Utilizatorul nu a fost găsit.");
        user.Email = dto.Email;
        user.IsLocked = dto.IsLocked;
        user.SecurityStamp = Guid.NewGuid();
        var requested = dto.RoleIds.Distinct().ToHashSet();
        _dataContext.UserRoles.RemoveRange(user.UserRoles.Where(item => !requested.Contains(item.RoleId)));
        var existing = user.UserRoles.Select(item => item.RoleId).ToHashSet();
        _dataContext.UserRoles.AddRange(requested.Except(existing)
            .Select(roleId => new UserRole { UserId = user.Id, RoleId = roleId }));
        await _dataContext.SaveChangesAsync();
    }

    public async Task UserDelete(int id)
    {
        var user = await _dataContext.Users.SingleOrDefaultAsync(item => item.Id == id)
            ?? throw new KeyNotFoundException("Utilizatorul nu a fost găsit.");
        _dataContext.Users.Remove(user);
        await _dataContext.SaveChangesAsync();
    }
}
