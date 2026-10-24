using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs.Contact;

public sealed class ContactMessagePostDTO
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public required string SenderName { get; init; }

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public required string SenderEmail { get; init; }

    [Required]
    [StringLength(250, MinimumLength = 3)]
    public required string Subject { get; init; }

    [Required]
    [StringLength(4000, MinimumLength = 20)]
    public required string Message { get; init; }

    [Required]
    [StringLength(4000, MinimumLength = 1)]
    public required string RecaptchaToken { get; init; }
}

public class ContactMessageSummaryDTO
{
    public int Id { get; init; }
    public string SenderName { get; init; } = string.Empty;
    public string SenderEmail { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTimeOffset CreatedAt { get; init; }
}

public sealed class ContactMessageDetailDTO : ContactMessageSummaryDTO
{
    public string Message { get; init; } = string.Empty;
    public DateTimeOffset? ReadAt { get; init; }
}
