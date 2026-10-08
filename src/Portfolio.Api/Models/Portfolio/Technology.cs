using Portfolio.Api.Models.Common;

namespace Portfolio.Api.Models.Portfolio;

public class Technology : AuditableEntity
{
    public required string Name { get; set; }
    public required string Category { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
    public virtual ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = [];
}
