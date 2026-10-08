using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Api.Configuration;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.Models.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portfolio.Api.Services.Authentication;

public class AuthenticationService(DataContext dataContext, IOptions<AuthSettings> authSettings) : IAuthenticationService
{
    private readonly DataContext _dataContext = dataContext;
    private readonly AuthSettings _settings = authSettings.Value;

    public async Task<GetInfoUserFromGoogle> AuthenticateWithGoogleAsync(string idToken)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken,
            new GoogleJsonWebSignature.ValidationSettings { Audience = [_settings.GoogleClientId] });
        return new GetInfoUserFromGoogle
        {
            Subject = payload.Subject, Name = payload.Name ?? string.Empty,
            GivenName = payload.GivenName ?? string.Empty, FamilyName = payload.FamilyName ?? string.Empty,
            Picture = payload.Picture ?? string.Empty, Email = payload.Email,
            IsEmailVerified = payload.EmailVerified, HostedDomain = payload.HostedDomain ?? string.Empty
        };
    }

    public async Task<GoogleSignInResult> SignInWithGoogleAsync(GetInfoUserFromGoogle googleUser)
    {
        if (!googleUser.IsEmailVerified)
            throw new GoogleSignInException(GoogleSignInFailure.EmailNotVerified);
        var email = DataContext.NormalizeEmail(googleUser.Email);
        var subject = googleUser.Subject.Trim();
        var bySubject = await _dataContext.Users.Include(item => item.Roles)
            .SingleOrDefaultAsync(item => item.GoogleSubject == subject);
        var byEmail = await _dataContext.Users.Include(item => item.Roles)
            .SingleOrDefaultAsync(item => item.Email == email);
        if (bySubject is not null && byEmail is not null && bySubject.Id != byEmail.Id)
            throw new GoogleSignInException(GoogleSignInFailure.IdentityConflict);

        var isNew = false;
        var subjectLinked = false;
        var user = bySubject ?? byEmail;
        if (user is null)
        {
            var defaultRole = await _dataContext.Roles.SingleOrDefaultAsync(item => item.Name == "USER" && item.IsActive)
                ?? throw new GoogleSignInException(GoogleSignInFailure.NoActiveRole);
            user = new User
            {
                Email = email, GoogleSubject = subject, FirstName = googleUser.GivenName,
                LastName = googleUser.FamilyName, ProfilePictureUrl = googleUser.Picture,
                SecurityStamp = Guid.NewGuid(), UserRoles = [new UserRole { Role = defaultRole }]
            };
            _dataContext.Users.Add(user);
            isNew = true;
        }
        else if (bySubject is null)
        {
            if (!string.IsNullOrWhiteSpace(user.GoogleSubject) && user.GoogleSubject != subject)
                throw new GoogleSignInException(GoogleSignInFailure.IdentityConflict);
            user.GoogleSubject = subject;
            subjectLinked = true;
        }

        if (user.IsLocked)
            throw new GoogleSignInException(GoogleSignInFailure.UserLocked);
        if (bySubject is not null && byEmail is null)
            user.Email = email;
        user.FirstName = googleUser.GivenName;
        user.LastName = googleUser.FamilyName;
        user.ProfilePictureUrl = googleUser.Picture;
        user.LastLoginAt = DateTimeOffset.UtcNow;
        var activeRoles = user.Roles.Where(item => item.IsActive).OrderBy(item => item.Priority).ToList();
        if (activeRoles.Count == 0)
            throw new GoogleSignInException(GoogleSignInFailure.NoActiveRole);
        await _dataContext.SaveChangesAsync();
        return new GoogleSignInResult(user, activeRoles, isNew, subjectLinked);
    }

    public string GenerateJwtToken(User user, IEnumerable<Role> roles)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()), new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Sid, user.SecurityStamp.ToString()), new(ClaimTypes.Name, user.DisplayName)
        };
        claims.AddRange(roles.Where(item => item.IsActive).Select(item => new Claim(ClaimTypes.Role, item.Name)));
        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims), Expires = DateTime.UtcNow.AddHours(_settings.JwtValidityInHours),
            Issuer = _settings.Issuer, Audience = _settings.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_settings.SecretKey)), SecurityAlgorithms.HmacSha256Signature)
        };
        return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityTokenHandler().CreateToken(descriptor));
    }
}
