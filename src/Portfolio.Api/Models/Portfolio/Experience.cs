using Portfolio.Api.Models.Common;

namespace Portfolio.Api.Models.Portfolio;

public class Experience : AuditableEntity
{
    public required string Company { get; set; }
    public required string Position { get; set; }
    public string? Location { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}
