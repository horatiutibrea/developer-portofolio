using Serilog.Context;

namespace Portfolio.Api.Middleware
{
    public sealed class CorrelationIdMiddleware(RequestDelegate next)
    {
        public const string HeaderName = "X-Correlation-ID";
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = context.Request.Headers[HeaderName].FirstOrDefault()
                ?? Guid.NewGuid().ToString("N");
            context.Response.Headers[HeaderName] = correlationId;

            using (LogContext.PushProperty("CorrelationId", correlationId))
            using (LogContext.PushProperty(
                "UserId",
                context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value))
            {
                await _next(context);
            }
        }
    }
}
