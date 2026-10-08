using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.DTOs.Contact;
using Portfolio.Api.Services.Authentication;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/contact")]
public sealed class ContactController(IAuthenticationService authenticationService) : ControllerBase
{
    private readonly IAuthenticationService _authenticationService = authenticationService;

    [AllowAnonymous]
    [HttpPost("google-profile")]
    [EnableRateLimiting("contact-google")]
    public async Task<ActionResult<ContactGoogleProfileDTO>> GetGoogleProfile(
        [FromBody] GoogleAuthResponse request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new
            {
                Message = "Credentialul Google lipsește.",
                MessageKey = "api.googleCredentialMissing"
            });
        }

        try
        {
            var googleUser = await _authenticationService.AuthenticateWithGoogleAsync(request.Token);
            if (!googleUser.IsEmailVerified || string.IsNullOrWhiteSpace(googleUser.Email))
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    Message = "Adresa de e-mail Google nu este verificată.",
                    MessageKey = "api.googleEmailNotVerified"
                });
            }

            var displayName = string.IsNullOrWhiteSpace(googleUser.Name)
                ? string.Join(' ', new[] { googleUser.GivenName, googleUser.FamilyName }
                    .Where(value => !string.IsNullOrWhiteSpace(value)))
                : googleUser.Name;

            return Ok(new ContactGoogleProfileDTO
            {
                FirstName = googleUser.GivenName,
                LastName = googleUser.FamilyName,
                DisplayName = displayName,
                Email = googleUser.Email,
                EmailVerified = true,
                ProfilePictureUrl = string.IsNullOrWhiteSpace(googleUser.Picture)
                    ? null
                    : googleUser.Picture
            });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized(new
            {
                Message = "Credentialul Google este invalid sau a expirat.",
                MessageKey = "api.googleCredentialInvalid"
            });
        }
    }
}
