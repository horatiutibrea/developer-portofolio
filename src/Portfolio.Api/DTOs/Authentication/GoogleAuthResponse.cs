namespace Portfolio.Api.DTOs.Authentication
{
    public class GoogleAuthResponse
    {
        public string? GoogleToken { get; set; }

        // Păstrat pentru compatibilitate cu aplicațiile generate anterior.
        public string? AccessToken { get; set; }

        public string? Token => GoogleToken ?? AccessToken;
    }
}
