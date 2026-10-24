using System.Text.Json.Serialization;
using Portfolio.Api.Configuration;
using Microsoft.Extensions.Options;

namespace Portfolio.Api.Services.Contact;

public interface IRecaptchaVerifier
{
    Task<RecaptchaVerification> VerifyAsync(string token, CancellationToken cancellationToken = default);
}

public sealed record RecaptchaVerification(bool Configured, bool Accepted);

public sealed class RecaptchaVerifier(IHttpClientFactory httpClientFactory, IOptions<RecaptchaSettings> settings)
    : IRecaptchaVerifier
{
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly RecaptchaSettings _settings = settings.Value;

    public async Task<RecaptchaVerification> VerifyAsync(string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.SecretKey))
            return new RecaptchaVerification(false, false);

        using var client = _httpClientFactory.CreateClient("recaptcha");
        using var response = await client.PostAsync(
            "https://www.google.com/recaptcha/api/siteverify",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["secret"] = _settings.SecretKey,
                ["response"] = token
            }),
            cancellationToken);

        if (!response.IsSuccessStatusCode)
            return new RecaptchaVerification(true, false);

        var payload = await response.Content.ReadFromJsonAsync<RecaptchaResponse>(cancellationToken);
        var hostname = payload?.Hostname ?? string.Empty;
        var accepted = payload?.Success == true
            && _settings.Hostnames.Contains(hostname, StringComparer.OrdinalIgnoreCase);
        return new RecaptchaVerification(true, accepted);
    }

    private sealed class RecaptchaResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("hostname")]
        public string? Hostname { get; set; }
    }
}
