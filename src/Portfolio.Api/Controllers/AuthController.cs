using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.Services.Authentication;
using System.Security.Claims;

namespace Portfolio.Api.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(
    IAuthenticationService authenticationService,
    DataContext dataContext,
    ILogger<AuthController> logger,
    IOptions<AuthSettings> authSettings) : ControllerBase
{
    private readonly IAuthenticationService _authenticationService = authenticationService;
    private readonly DataContext _dataContext = dataContext;
    private readonly ILogger<AuthController> _logger = logger;
    private readonly AuthSettings _settings = authSettings.Value;

    [Authorize]
    [HttpGet("user")]
    public async Task<ActionResult> GetUserDetails()
    {
        var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idValue, out var id)) return Unauthorized();
        var user = await _dataContext.Users.AsNoTracking().Include(item => item.Roles)
            .SingleOrDefaultAsync(item => item.Id == id);
        if (user is null || user.IsLocked) return NotFound(new { Message = "Utilizatorul nu a fost găsit.", MessageKey = "api.userNotFound" });
        var primaryRole = user.Roles.Where(item => item.IsActive).OrderBy(item => item.Priority).FirstOrDefault();
        if (primaryRole is null) return StatusCode(403, new { Message = "Utilizatorul nu are un rol activ.", MessageKey = "api.userHasNoRole" });
        return Ok(ToProfile(user, primaryRole.Name));
    }

    [AllowAnonymous]
    [HttpPost("verify")]
    [HttpPost("verify/admin")]
    [HttpPost("google")]
    [EnableRateLimiting("authentication")]
    public async Task<ActionResult> GoogleAuthentication([FromBody] GoogleAuthResponse request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
            return BadRequest(new { Message = "Credentialul Google lipsește.", MessageKey = "api.googleCredentialMissing" });
        try
        {
            var googleUser = await _authenticationService.AuthenticateWithGoogleAsync(request.Token);
            var result = await _authenticationService.SignInWithGoogleAsync(googleUser);
            if (Request.Path.Value?.EndsWith("/admin", StringComparison.OrdinalIgnoreCase) == true &&
                !result.ActiveRoles.Any(item => item.Name.Equals("SUPERADMIN", StringComparison.OrdinalIgnoreCase)))
                return StatusCode(403, new { Message = "Zona este disponibilă doar utilizatorilor SUPERADMIN.", MessageKey = "api.superadminRequired" });

            var primaryRole = result.ActiveRoles.OrderBy(item => item.Priority).First();
            var profile = ToProfile(result.User, primaryRole.Name);
            var token = _authenticationService.GenerateJwtToken(result.User, result.ActiveRoles);
            Response.Cookies.Append("token", token, new CookieOptions
            {
                HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true,
                Path = "/", MaxAge = TimeSpan.FromHours(_settings.JwtValidityInHours)
            });
            return Ok(profile);
        }
        catch (GoogleSignInException ex)
        {
            return ex.Failure switch
            {
                GoogleSignInFailure.EmailNotVerified => StatusCode(403, new { Message = "Adresa de e-mail Google nu este verificată.", MessageKey = "api.googleEmailNotVerified" }),
                GoogleSignInFailure.IdentityConflict => Conflict(new { Message = "Identitatea Google este deja asociată altui cont.", MessageKey = "api.googleIdentityConflict" }),
                GoogleSignInFailure.UserLocked => StatusCode(403, new { Message = "Nu aveți drepturi de conectare.", MessageKey = "api.loginNotAllowed" }),
                _ => StatusCode(403, new { Message = "Utilizatorul nu are un rol activ.", MessageKey = "api.userHasNoRole" })
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google authentication failed.");
            return StatusCode(500, new { Message = "A apărut o eroare la autentificarea cu Google!", MessageKey = "api.googleAuthenticationFailed" });
        }
    }

    [Authorize]
    [HttpGet("session")]
    public IActionResult Session() => Ok(new { authenticated = true, expiresAt = User.FindFirst("exp")?.Value });

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("token", new CookieOptions
        { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None, IsEssential = true, Path = "/" });
        return Ok(new { Message = "Deconectare realizată cu succes", MessageKey = "api.logoutSuccess" });
    }

    private static GetAuthUserProfile ToProfile(Models.Identity.User user, string roleName) => new()
    {
        Id = user.Id, LastName = user.LastName, FirstName = user.FirstName, Email = user.Email,
        SecurityStamp = user.SecurityStamp.ToString(), ProfilePictureUrl = user.ProfilePictureUrl, RoleName = roleName
    };
}
