namespace Portfolio.Api.DTOs.Contact;

public sealed class ContactGoogleProfileDTO
{
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string DisplayName { get; init; }
    public required string Email { get; init; }
    public required bool EmailVerified { get; init; }
    public string? ProfilePictureUrl { get; init; }
}
