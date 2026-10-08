using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Portfolio.Api.Configuration;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Authentication;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Services.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Portfolio.Api.Tests;

public sealed class AuthenticationServiceTests
{
    [Fact]
    public async Task AnyVerifiedGoogleAccountCanSignIn()
    {
        await using var context = await CreateContext();
        var result = await CreateService(context).SignInWithGoogleAsync(GoogleUser("person@gmail.com", "sub-gmail"));
        Assert.True(result.IsNewUser);
        Assert.Equal("person@gmail.com", result.User.Email);
        Assert.Equal(["USER"], result.ActiveRoles.Select(item => item.Name));
    }

    [Fact]
    public async Task NewGoogleIdentityCreatesUserWithOnlyUserRole()
    {
        await using var context = await CreateContext();
        var result = await CreateService(context).SignInWithGoogleAsync(GoogleUser("new@net.ase.ro", "sub-new"));
        Assert.True(result.IsNewUser);
        Assert.Equal("sub-new", result.User.GoogleSubject);
        Assert.Equal(["USER"], result.ActiveRoles.Select(item => item.Name));
    }

    [Fact]
    public async Task VerifiedLegacyEmailIsLinkedToGoogleSubject()
    {
        await using var context = await CreateContext();
        var role = await context.Roles.SingleAsync(item => item.Name == "USER");
        context.Users.Add(new User
        {
            Email = "legacy@net.ase.ro", FirstName = "Old", LastName = "User",
            SecurityStamp = Guid.NewGuid(), UserRoles = [new UserRole { Role = role }]
        });
        await context.SaveChangesAsync();
        var result = await CreateService(context).SignInWithGoogleAsync(GoogleUser("LEGACY@net.ase.ro", "legacy-sub"));
        Assert.True(result.SubjectLinked);
        Assert.Equal("legacy-sub", result.User.GoogleSubject);
    }

    [Fact]
    public async Task SubjectAndEmailOwnedByDifferentUsersAreRejected()
    {
        await using var context = await CreateContext();
        var role = await context.Roles.SingleAsync(item => item.Name == "USER");
        context.Users.AddRange(
            new User { Email = "subject@net.ase.ro", GoogleSubject = "shared-sub", SecurityStamp = Guid.NewGuid(), UserRoles = [new UserRole { Role = role }] },
            new User { Email = "email@net.ase.ro", SecurityStamp = Guid.NewGuid(), UserRoles = [new UserRole { Role = role }] });
        await context.SaveChangesAsync();
        var exception = await Assert.ThrowsAsync<GoogleSignInException>(() =>
            CreateService(context).SignInWithGoogleAsync(GoogleUser("email@net.ase.ro", "shared-sub")));
        Assert.Equal(GoogleSignInFailure.IdentityConflict, exception.Failure);
    }

    [Fact]
    public async Task LockedUserCannotSignIn()
    {
        await using var context = await CreateContext();
        context.Users.Add(new User { Email = "locked@net.ase.ro", GoogleSubject = "locked-sub", IsLocked = true, SecurityStamp = Guid.NewGuid() });
        await context.SaveChangesAsync();
        var exception = await Assert.ThrowsAsync<GoogleSignInException>(() =>
            CreateService(context).SignInWithGoogleAsync(GoogleUser("locked@net.ase.ro", "locked-sub")));
        Assert.Equal(GoogleSignInFailure.UserLocked, exception.Failure);
    }

    [Fact]
    public async Task JwtContainsOnlyActiveRoles()
    {
        await using var context = await CreateContext();
        var user = new User { Id = 42, Email = "jwt@net.ase.ro", SecurityStamp = Guid.NewGuid() };
        var token = CreateService(context).GenerateJwtToken(user,
        [
            new Role { Name = "USER", IsActive = true, Priority = 100 },
            new Role { Name = "ADMIN", IsActive = false, Priority = 1 }
        ]);
        var claims = new JwtSecurityTokenHandler().ReadJwtToken(token).Claims.ToList();
        Assert.Contains(claims, item => item.Type is ClaimTypes.Role or "role" && item.Value == "USER");
        Assert.DoesNotContain(claims, item => item.Type is ClaimTypes.Role or "role" && item.Value == "ADMIN");
    }

    private static async Task<DataContext> CreateContext()
    {
        var context = new DataContext(new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        await context.Database.EnsureCreatedAsync();
        return context;
    }

    private static AuthenticationService CreateService(DataContext context) => new(context, Options.Create(new AuthSettings
    {
        SecretKey = new string('x', 64), GoogleClientId = "test", JwtValidityInHours = 1,
        Issuer = "tests", Audience = "tests"
    }));

    private static GetInfoUserFromGoogle GoogleUser(string email, string subject) => new()
    {
        Email = email, Subject = subject, IsEmailVerified = true, GivenName = "Test", FamilyName = "User"
    };
}
