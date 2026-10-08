using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Services.Authentication;

public interface IAuthenticationService
{
    Task<GetInfoUserFromGoogle> AuthenticateWithGoogleAsync(string idToken);
    Task<GoogleSignInResult> SignInWithGoogleAsync(GetInfoUserFromGoogle googleUser);
    string GenerateJwtToken(User user, IEnumerable<Role> roles);
}
