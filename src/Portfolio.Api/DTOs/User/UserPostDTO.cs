using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Portfolio.Api.DTOs.User;

public sealed class UserPostDTO
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public required string Email { get; set; }

    [JsonPropertyName("listaRoluri")]
    public List<int> RoleIds { get; set; } = [];
}
