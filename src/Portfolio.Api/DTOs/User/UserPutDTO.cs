using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Portfolio.Api.DTOs.User;

public sealed class UserPutDTO
{
    [Range(1, int.MaxValue)]
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("lockoutEnabled")]
    public bool IsLocked { get; set; }
    [JsonPropertyName("listaRoluri")]
    public List<int> RoleIds { get; set; } = [];
}
