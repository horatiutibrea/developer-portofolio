using Portfolio.Api.Models.Common;
using System.Text.Json.Serialization;

namespace Portfolio.Api.Models.Identity;

public class Role : BaseEntity
{
    public required string Name { get; set; }
    public bool IsActive { get; set; } = true;
    public int Priority { get; set; }

    [JsonIgnore]
    public virtual ICollection<User> Users { get; set; } = [];

    [JsonIgnore]
    public virtual ICollection<UserRole> UserRoles { get; set; } = [];
}
