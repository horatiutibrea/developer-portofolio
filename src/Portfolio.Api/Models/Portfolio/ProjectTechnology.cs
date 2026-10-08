namespace Portfolio.Api.Models.Portfolio;

public class ProjectTechnology
{
    public int ProjectId { get; set; }
    public virtual Project Project { get; set; } = null!;
    public int TechnologyId { get; set; }
    public virtual Technology Technology { get; set; } = null!;
}
