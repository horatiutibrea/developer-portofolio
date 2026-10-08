using Portfolio.Api.Controllers;
using Microsoft.AspNetCore.Authorization;

namespace Portfolio.Api.Tests;

public sealed class SuperAdminAuthorizationTests
{
    [Theory]
    [InlineData(typeof(UsersController))]
    [InlineData(typeof(RolesController))]
    public void MonitoringControllersRequireSuperAdmin(Type controllerType)
    {
        var attribute = Assert.Single(
            controllerType.GetCustomAttributes(typeof(AuthorizeAttribute), true)
                .Cast<AuthorizeAttribute>());

        Assert.Equal("SUPERADMIN", attribute.Roles);
    }
}
