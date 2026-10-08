using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Models.Common;
using Portfolio.Api.Models.Portfolio;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Portfolio.Api.Models.Identity;

[Index(nameof(Email), IsUnique = true)]
public class User : BaseEntity
{
    [JsonIgnore]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;

    [NotMapped]
    public string DisplayName => $"{FirstName} {LastName}".Trim();

    [JsonIgnore]
    public string? ProfilePictureUrl { get; set; }

    [JsonIgnore]
    public string? GoogleSubject { get; set; }

    public Guid SecurityStamp { get; set; }

    [JsonIgnore]
    public bool IsLocked { get; set; }

    [JsonIgnore]
    public DateTimeOffset? LastLoginAt { get; set; }

    [JsonIgnore]
    public virtual ICollection<Role> Roles { get; set; } = [];

    [JsonIgnore]
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];

    [JsonIgnore]
    public virtual ICollection<PageContent> UpdatedPageContents { get; set; } = [];

    [JsonIgnore]
    public virtual ICollection<Consent> Consents { get; set; } = [];

    [JsonIgnore]
    public virtual ICollection<ContactMessage> ContactMessages { get; set; } = [];
}
