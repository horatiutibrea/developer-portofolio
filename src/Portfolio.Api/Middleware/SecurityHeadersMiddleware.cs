namespace Portfolio.Api.Middleware
{
    public sealed class SecurityHeadersMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            context.Response.OnStarting(() =>
            {
                var headers = context.Response.Headers;
                headers.XContentTypeOptions = "nosniff";
                headers.XFrameOptions = "DENY";
                headers.Append("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
                headers.Append("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
                headers.Append(
                    "Content-Security-Policy",
                    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; " +
                    "script-src 'self' https://accounts.google.com; frame-src 'self' blob: https://accounts.google.com; " +
                    "connect-src 'self' https://accounts.google.com https://www.googleapis.com;");
                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}
