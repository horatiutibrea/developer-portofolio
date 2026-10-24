using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Api.Data;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Services.Authentication;

namespace Portfolio.Api.Tests;

public sealed class PortfolioContentEndpointTests : IClassFixture<ApiSecurityFactory>
{
    private readonly HttpClient _client;
    private readonly ApiSecurityFactory _factory;

    public PortfolioContentEndpointTests(ApiSecurityFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new()
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://localhost"),
            HandleCookies = true,
        });
    }

    [Fact]
    public async Task TokenIssuedBeforeLoginIsRejected()
    {
        await UseFreshCsrfToken();
        await Authorize();

        var response = await _client.PostAsJsonAsync("/api/portfolio/experiences", ExperiencePayload());
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task TokenIssuedAfterLoginAcceptsTheAdminFormPayload()
    {
        await Authorize();
        await UseFreshCsrfToken();

        var response = await _client.PostAsJsonAsync("/api/portfolio/experiences", ExperiencePayload());
        var body = await response.Content.ReadAsStringAsync();
        Assert.True(response.StatusCode == HttpStatusCode.OK, body);
    }

    private async Task UseFreshCsrfToken()
    {
        _client.DefaultRequestHeaders.Remove("X-XSRF-TOKEN");
        var csrf = await _client.GetFromJsonAsync<JsonElement>("/api/security/csrf");
        _client.DefaultRequestHeaders.Add("X-XSRF-TOKEN", csrf.GetProperty("token").GetString());
    }

    private static object ExperiencePayload() => new
    {
        company = "Example",
        position = "Engineer",
        location = (string?)null,
        startDate = "2024-01-15",
        endDate = (string?)null,
        isCurrent = true,
        description = (string?)null,
        displayOrder = 0,
        isPublished = true,
    };

    private async Task Authorize()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        await context.Database.EnsureCreatedAsync();
        var role = await context.Roles.SingleAsync(item => item.Name == "SUPERADMIN");
        var user = new User
        {
            Email = $"admin-{Guid.NewGuid():N}@example.com",
            FirstName = "Admin",
            LastName = "Test",
            SecurityStamp = Guid.NewGuid(),
            UserRoles = [new UserRole { Role = role }],
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        var token = scope.ServiceProvider.GetRequiredService<IAuthenticationService>()
            .GenerateJwtToken(user, [role]);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
