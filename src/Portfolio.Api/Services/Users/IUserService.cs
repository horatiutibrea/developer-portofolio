using Portfolio.Api.DTOs.User;

namespace Portfolio.Api.Services.Users
{
    public interface IUserService
    {
        Task<IEnumerable<UserGetDTO>> GetAllUsersAsync();

        Task UserPost(UserPostDTO userPostDTO);
        Task UserPut(UserPutDTO userPutDTO);
        Task UserDelete(int id);
    }
}
