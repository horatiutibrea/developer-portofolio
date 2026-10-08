using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Models.Portfolio;

public class Consent
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;
    public ConsentType Type { get; set; }
    public required string PolicyVersion { get; set; }
    public DateTimeOffset AcceptedAt { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }
    public virtual ContactMessage? ContactMessage { get; set; }
}
