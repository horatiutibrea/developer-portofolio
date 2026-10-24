using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Controllers;
using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.DTOs.Contact;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Services.Authentication;

namespace Portfolio.Api.Tests;

public sealed class ContactControllerTests
{
    [Fact]
    public async Task GoogleProfileReturnsOnlyVerifiedContactIdentityWithoutSigningIn()
    {
        var authenticationService = new ContactAuthenticationServiceStub(new GetInfoUserFromGoogle
        {
            Subject = "google-subject-not-returned",
            GivenName = "Ada",
            FamilyName = "Lovelace",
            Name = "Ada Lovelace",
            Email = "ada@example.com",
            IsEmailVerified = true,
            Picture = "https://example.com/avatar.jpg"
        });
        var controller = new ContactController(authenticationService, null!);

        var response = await controller.GetGoogleProfile(new GoogleAuthResponse
        {
            GoogleToken = "credential"
        });

        var ok = Assert.IsType<OkObjectResult>(response.Result);
        var profile = Assert.IsType<ContactGoogleProfileDTO>(ok.Value);
        Assert.Equal("Ada", profile.FirstName);
        Assert.Equal("Lovelace", profile.LastName);
        Assert.Equal("Ada Lovelace", profile.DisplayName);
        Assert.Equal("ada@example.com", profile.Email);
        Assert.True(profile.EmailVerified);
        Assert.Equal("https://example.com/avatar.jpg", profile.ProfilePictureUrl);
        Assert.Equal(1, authenticationService.ValidationCalls);
        Assert.Equal(0, authenticationService.SignInCalls);
    }

    [Fact]
    public async Task GoogleProfileRejectsUnverifiedEmailWithoutSigningIn()
    {
        var authenticationService = new ContactAuthenticationServiceStub(new GetInfoUserFromGoogle
        {
            Subject = "subject",
            Email = "unverified@example.com",
            IsEmailVerified = false
        });
        var controller = new ContactController(authenticationService, null!);

        var response = await controller.GetGoogleProfile(new GoogleAuthResponse
        {
            GoogleToken = "credential"
        });

        var result = Assert.IsType<ObjectResult>(response.Result);
        Assert.Equal(403, result.StatusCode);
        Assert.Equal(0, authenticationService.SignInCalls);
    }

    private sealed class ContactAuthenticationServiceStub(GetInfoUserFromGoogle googleUser)
        : IAuthenticationService
    {
        public int ValidationCalls { get; private set; }
        public int SignInCalls { get; private set; }

        public Task<GetInfoUserFromGoogle> AuthenticateWithGoogleAsync(string idToken)
        {
            ValidationCalls++;
            return Task.FromResult(googleUser);
        }

        public Task<GoogleSignInResult> SignInWithGoogleAsync(GetInfoUserFromGoogle googleUser)
        {
            SignInCalls++;
            throw new InvalidOperationException("Contact identification must not create an application session.");
        }

        public string GenerateJwtToken(User user, IEnumerable<Role> roles) =>
            throw new InvalidOperationException("Contact identification must not issue an application token.");
    }
}
