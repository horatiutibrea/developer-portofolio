namespace Portfolio.Api.Configuration
{
    public class AuthSettings
    {
        public string SecretKey { get; set; } = null!;
        public string GoogleClientId { get; set; } = null!;
        public int JwtValidityInHours { get; set; } = 0;
        public string Issuer { get; set; } = "ase-app-template";
        public string Audience { get; set; } = "ase-app-template-frontend";
    }
}
