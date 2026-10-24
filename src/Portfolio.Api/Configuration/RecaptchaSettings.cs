namespace Portfolio.Api.Configuration;

public sealed class RecaptchaSettings
{
    public string? SecretKey { get; set; }

    public string[] Hostnames { get; set; } =
    [
        "horatiutibrea.ro",
        "www.horatiutibrea.ro",
        "localhost",
        "127.0.0.1"
    ];
}
