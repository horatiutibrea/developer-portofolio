using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.Models.Portfolio;

namespace Portfolio.Api.Tests;

public sealed class PortfolioDataModelTests
{
    [Fact]
    public async Task SaveNormalizesEmailPageKeyAndProjectSlug()
    {
        await using var context = new DataContext(new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        context.PageContents.Add(new PageContent { Key = "  HERO.Main ", Title = "Hero" });
        context.Projects.Add(new Project { Title = "A", Slug = "  My New_Project  ", ShortDescription = "Test" });
        await context.SaveChangesAsync();
        Assert.Equal("hero.main", (await context.PageContents.SingleAsync()).Key);
        Assert.Equal("my-new-project", (await context.Projects.SingleAsync()).Slug);
    }

    [Fact]
    public void EnumsHaveStablePersistedValues()
    {
        Assert.Equal(1, (int)ConsentType.ContactForm);
        Assert.Equal(1, (int)ContactMessageStatus.New);
        Assert.Equal(2, (int)ContactMessageStatus.Read);
        Assert.Equal(3, (int)ContactMessageStatus.Resolved);
    }
}
