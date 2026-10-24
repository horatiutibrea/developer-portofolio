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

        _dataContext.ContactMessages.Add(new ContactMessage
        {
            SenderName = request.SenderName.Trim(),
            SenderEmail = DataContext.NormalizeEmail(request.SenderEmail),
            Subject = request.Subject.Trim(),
            Message = request.Message.Trim(),
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

        return new ContactMessageDetailDTO
        {
            Id = message.Id,
            SenderName = message.SenderName,
            SenderEmail = message.SenderEmail,
            Subject = message.Subject,
            Status = message.Status.ToString(),
            CreatedAt = message.CreatedAt,
            Message = message.Message,
            ReadAt = message.ReadAt
        };
    }

    private static ContactMessageSummaryDTO MapSummary(ContactMessage message) => new()
    {
        Id = message.Id,
        SenderName = message.SenderName,
        SenderEmail = message.SenderEmail,
        Subject = message.Subject,
        Status = message.Status.ToString(),
        CreatedAt = message.CreatedAt
    };
}
