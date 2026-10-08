using Portfolio.Api.DTOs.Roles;
using System.Text.Json.Serialization;

namespace Portfolio.Api.DTOs.User
{
    public class UserGetDTO
    {
        public int Id { get; set; }
        [JsonPropertyName("nume")]
        public string LastName { get; set; } = null!;
        [JsonPropertyName("prenume")]
        public string FirstName { get; set; } = null!;
        public string Email { get; set; } = null!;
        [JsonPropertyName("listaRoluri")]
        public List<RoleDTO> Roles { get; set; } = [];
        [JsonPropertyName("lockoutEnabled")]
        public bool IsLocked { get; set; }
        [JsonPropertyName("lastLogin")]
        public DateTimeOffset? LastLoginAt { get; set; }
    }
}
