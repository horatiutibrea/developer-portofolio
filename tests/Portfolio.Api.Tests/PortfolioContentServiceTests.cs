using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Portfolio;
using Portfolio.Api.Services.Portfolio;

namespace Portfolio.Api.Tests;

public sealed class PortfolioContentServiceTests
{
    [Fact]
    public async Task CurrentExperienceClearsTheEndDateAndUnpublishedItemsStayHidden()
    {
        await using var context = await CreateContext();
        var service = new PortfolioContentService(context);
        var saved = await service.SaveExperienceAsync(null, new ExperienceWriteDto
        {
            Company = "Example",
            Position = "Engineer",
            StartDate = new DateOnly(2024, 1, 1),
            EndDate = new DateOnly(2024, 6, 1),
            IsCurrent = true,
            IsPublished = false,
        });

        Assert.Null(saved.EndDate);
        Assert.Empty(await service.GetExperiencesAsync(publishedOnly: true));
        Assert.Single(await service.GetExperiencesAsync(publishedOnly: false));
    }

    [Fact]
    public async Task ProjectSlugIsDerivedFromTheTitle()
    {
        await using var context = await CreateContext();
        var service = new PortfolioContentService(context);
        var saved = await service.SaveProjectAsync(null, new ProjectWriteDto
        {
            Title = "Developer Portfolio",
            ShortDescription = "A portfolio site.",
        });

        Assert.Equal("developer-portfolio", saved.Slug);
    }

    private static async Task<DataContext> CreateContext()
    {
        var context = new DataContext(new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        await context.Database.EnsureCreatedAsync();
        return context;
    }
}
