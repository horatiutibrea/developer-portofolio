using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Portfolio.Api.DTOs.Roles;

public sealed class RoleDTO
{
    public int? Id { get; set; }

    [Required]
    [MaxLength(100)]
    [RegularExpression("^[A-Z][A-Z0-9_]*$")]
    [JsonPropertyName("denumire")]
    public required string Name { get; set; }

    [JsonPropertyName("esteActiv")]
    public bool IsActive { get; set; }

    [Range(0, 10000)]
    [JsonPropertyName("prioritate")]
    public int Priority { get; set; }
}
