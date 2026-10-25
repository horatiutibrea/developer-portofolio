using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Contact;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Services.Contact;
using Portfolio.Api.Services.Portfolio;

namespace Portfolio.Api.Tests;

public sealed class ContactMessageServiceTests
{
    [Fact]
    public async Task AcceptedVisitorMessageIsStoredAndMarkedReadWhenOpened()
    {
        await using var context = await CreateContext();
        var service = new ContactMessageService(context, new StubRecaptcha(configured: true, accepted: true));
        await service.SaveAsync(Sample());

        var listed = await service.ListAsync();
        var summary = Assert.Single(listed);
        Assert.Equal("New", summary.Status);
        Assert.Equal("ada@example.com", summary.SenderEmail);

        var detail = await service.ReadAsync(summary.Id);
        Assert.Equal("Read", detail.Status);
        Assert.Equal("Hello from the contact form.", detail.Message);
        Assert.NotNull(detail.ReadAt);
    }

    [Fact]
    public async Task RejectedRecaptchaDoesNotStoreTheMessage()
    {
        await using var context = await CreateContext();
        var service = new ContactMessageService(context, new StubRecaptcha(configured: true, accepted: false));

        var exception = await Assert.ThrowsAsync<ContentRuleException>(() => service.SaveAsync(Sample()));

        Assert.Equal(400, exception.Status);
        Assert.Equal("api.recaptchaFailed", exception.MessageKey);
        Assert.Empty(context.ContactMessages);
    }

    [Fact]
    public async Task MissingRecaptchaSecretRejectsTheMessage()
    {
        await using var context = await CreateContext();
        var service = new ContactMessageService(context, new StubRecaptcha(configured: false, accepted: false));

        var exception = await Assert.ThrowsAsync<ContentRuleException>(() => service.SaveAsync(Sample()));

        Assert.Equal(503, exception.Status);
        Assert.Empty(context.ContactMessages);
    }

    private static ContactMessagePostDTO Sample() => new()
    {
        SenderName = "Ada Lovelace",
        SenderEmail = "Ada@Example.com",
        Subject = "Project idea",
        Message = "Hello from the contact form.",
        RecaptchaToken = "token"
    };

    private static async Task<DataContext> CreateContext()
    {
        var context = new DataContext(new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        await context.Database.EnsureCreatedAsync();
        context.Users.Add(new User
        {
            Email = "owner@example.com",
            FirstName = "Owner",
            LastName = "Test",
            SecurityStamp = Guid.NewGuid()
        });
        await context.SaveChangesAsync();
        return context;
    }

    private sealed class StubRecaptcha(bool configured, bool accepted) : IRecaptchaVerifier
    {
        public Task<RecaptchaVerification> VerifyAsync(string token, CancellationToken cancellationToken = default) =>
            Task.FromResult(new RecaptchaVerification(configured, accepted));
    }
}
