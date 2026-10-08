using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs.Contact;

// Prepared for a future message endpoint. The Google credential must be
// revalidated server-side when the message is persisted.
public sealed class ContactMessagePostDTO
{
    [Required]
    public required string GoogleToken { get; init; }

    [Required]
    [StringLength(250, MinimumLength = 3)]
    public required string Subject { get; init; }

    [Required]
    [StringLength(4000, MinimumLength = 20)]
    public required string Message { get; init; }
}
