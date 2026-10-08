using Portfolio.Api.Models.Common;

namespace Portfolio.Api.Models.Portfolio;

public class Project : AuditableEntity
{
    public required string Title { get; set; }
    public required string Slug { get; set; }
    public required string ShortDescription { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? RepositoryUrl { get; set; }
    public string? LiveUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; } = true;
    public virtual ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = [];
}
