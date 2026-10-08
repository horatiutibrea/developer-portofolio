namespace Portfolio.Api.Services.Portfolio;

public sealed class ContentRuleException(int status, string messageKey) : Exception(messageKey)
{
    public int Status { get; } = status;
    public string MessageKey { get; } = messageKey;
}
