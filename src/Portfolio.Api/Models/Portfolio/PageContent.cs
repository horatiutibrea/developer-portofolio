using Portfolio.Api.Models.Common;
using Portfolio.Api.Models.Identity;

namespace Portfolio.Api.Models.Portfolio;

public class PageContent : AuditableEntity
{
    public required string Key { get; set; }
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public bool IsPublished { get; set; } = true;
    public int? UpdatedByUserId { get; set; }
    public virtual User? UpdatedByUser { get; set; }
}
