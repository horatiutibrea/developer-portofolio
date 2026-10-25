using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Contact;
using Portfolio.Api.Models.Portfolio;
using Portfolio.Api.Services.Portfolio;

namespace Portfolio.Api.Services.Contact;

public sealed class ContactMessageService(DataContext dataContext, IRecaptchaVerifier recaptcha)
{
    private readonly DataContext _dataContext = dataContext;
    private readonly IRecaptchaVerifier _recaptcha = recaptcha;

    public async Task SaveAsync(ContactMessagePostDTO request, CancellationToken cancellationToken = default)
    {
        var verification = await _recaptcha.VerifyAsync(request.RecaptchaToken, cancellationToken);
        if (!verification.Configured)
            throw new ContentRuleException(StatusCodes.Status503ServiceUnavailable, "api.contactUnavailable");
        if (!verification.Accepted)
            throw new ContentRuleException(StatusCodes.Status400BadRequest, "api.recaptchaFailed");

        var user = await _dataContext.Users.OrderBy(item => item.Id).FirstOrDefaultAsync(cancellationToken)
            ?? throw new ContentRuleException(StatusCodes.Status503ServiceUnavailable, "api.contactUnavailable");
        var name = request.SenderName.Trim();
        var email = DataContext.NormalizeEmail(request.SenderEmail);
        var body = request.Message.Trim();
        var stored = JsonSerializer.Serialize(new StoredContact(name, email, body));
        if (stored.Length > 4000)
            throw new ContentRuleException(StatusCodes.Status400BadRequest, "api.validationFailed");

        _dataContext.ContactMessages.Add(new ContactMessage
        {
            UserId = user.Id,
            Consent = new Consent
            {
                UserId = user.Id,
                Type = ConsentType.ContactForm,
                PolicyVersion = "contact-form"
            },
            Subject = request.Subject.Trim(),
            Message = stored,
            Status = ContactMessageStatus.New
        });
        await _dataContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ContactMessageSummaryDTO>> ListAsync(CancellationToken cancellationToken = default)
    {
        var items = await _dataContext.ContactMessages.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt)
            .ToListAsync(cancellationToken);
        return items.Select(MapSummary).ToList();
    }

    public async Task<ContactMessageDetailDTO> ReadAsync(int id, CancellationToken cancellationToken = default)
    {
        var message = await _dataContext.ContactMessages.SingleOrDefaultAsync(item => item.Id == id, cancellationToken)
            ?? throw new ContentRuleException(StatusCodes.Status404NotFound, "api.messageNotFound");
        if (message.Status == ContactMessageStatus.New)
        {
            message.Status = ContactMessageStatus.Read;
            message.ReadAt = DateTimeOffset.UtcNow;
            await _dataContext.SaveChangesAsync(cancellationToken);
        }

        var stored = Unpack(message.Message);
        return new ContactMessageDetailDTO
        {
            Id = message.Id,
            SenderName = stored.Name,
            SenderEmail = stored.Email,
            Subject = message.Subject,
            Status = message.Status.ToString(),
            CreatedAt = message.CreatedAt,
            Message = stored.Body,
            ReadAt = message.ReadAt
        };
    }

    private static ContactMessageSummaryDTO MapSummary(ContactMessage message)
    {
        var stored = Unpack(message.Message);
        return new ContactMessageSummaryDTO
        {
            Id = message.Id,
            SenderName = stored.Name,
            SenderEmail = stored.Email,
            Subject = message.Subject,
            Status = message.Status.ToString(),
            CreatedAt = message.CreatedAt
        };
    }

    private static StoredContact Unpack(string message)
    {
        try
        {
            return JsonSerializer.Deserialize<StoredContact>(message) ?? new StoredContact("", "", message);
        }
        catch (JsonException)
        {
            return new StoredContact("", "", message);
        }
    }

    private sealed record StoredContact(string Name, string Email, string Body);
}
