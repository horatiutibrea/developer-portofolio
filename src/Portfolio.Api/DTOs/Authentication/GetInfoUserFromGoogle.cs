namespace Portfolio.Api.DTOs.Authentication
{
    public class GetInfoUserFromGoogle
    {
        public string Subject { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string GivenName { get; set; } = string.Empty;
        public string FamilyName { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsEmailVerified { get; set; }
        public string HostedDomain { get; set; } = string.Empty;
    }
}
