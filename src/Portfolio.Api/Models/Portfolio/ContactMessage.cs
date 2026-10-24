using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Models.Portfolio;

public class ContactMessage
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public virtual User? User { get; set; }
    public int? ConsentId { get; set; }
    public virtual Consent? Consent { get; set; }
    public required string SenderName { get; set; }
    public required string SenderEmail { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
    public ContactMessageStatus Status { get; set; } = ContactMessageStatus.New;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? ReadAt { get; set; }
    public DateTimeOffset? ResolvedAt { get; set; }
}
