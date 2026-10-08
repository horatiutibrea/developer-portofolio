using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Api.Middleware
{
    public class ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ExceptionMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(
                    exception,
                    "Unhandled exception for {Method} {Path}",
                    context.Request.Method,
                    context.Request.Path);

                if (context.Response.HasStarted)
                {
                    throw;
                }

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Internal server error",
                    Detail = "A apărut o eroare internă.",
                    Instance = context.Request.Path
                };
                problem.Extensions["messageKey"] = "api.internalError";
                problem.Extensions["correlationId"] = context.TraceIdentifier;
                await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
            }
        }
    }
}
