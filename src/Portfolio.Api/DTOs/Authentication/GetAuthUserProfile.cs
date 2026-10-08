using System.Text.Json.Serialization;

namespace Portfolio.Api.DTOs.Authentication
{
    public class GetAuthUserProfile
    {
        public int Id { get; set; }
        [JsonPropertyName("nume")]
        public string LastName { get; set; } = null!;
        [JsonPropertyName("prenume")]
        public string FirstName { get; set; } = null!;
        public string Email { get; set; } = null!;
        [JsonPropertyName("guid")]
        public string SecurityStamp { get; set; } = null!;
        [JsonPropertyName("urlPozaProfil")]
        public string? ProfilePictureUrl { get; set; }
        [JsonPropertyName("rol")]
        public string RoleName { get; set; } = null!;
    }
}
