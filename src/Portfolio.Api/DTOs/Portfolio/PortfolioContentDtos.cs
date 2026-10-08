using System.ComponentModel.DataAnnotations;

namespace Portfolio.Api.DTOs.Portfolio;

public sealed class ExperienceWriteDto
{
    [Required, MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Position { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Location { get; set; }

    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public bool IsCurrent { get; set; }
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}

public sealed class ProjectWriteDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Slug { get; set; }

    [Required, MaxLength(500)]
    public string ShortDescription { get; set; } = string.Empty;

    public string? Description { get; set; }

    [MaxLength(1000)]
    public string? ImageUrl { get; set; }

    [MaxLength(1000)]
    public string? RepositoryUrl { get; set; }

    [MaxLength(1000)]
    public string? LiveUrl { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; } = true;
    public int[] TechnologyIds { get; set; } = [];
}

public sealed class TechnologyWriteDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Icon { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}

public sealed class ExperienceResponse
{
    public int Id { get; init; }
    public string Company { get; init; } = string.Empty;
    public string Position { get; init; } = string.Empty;
    public string? Location { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public bool IsCurrent { get; init; }
    public string? Description { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsPublished { get; init; }
}

public sealed class ProjectResponse
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string ShortDescription { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public string? RepositoryUrl { get; init; }
    public string? LiveUrl { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsFeatured { get; init; }
    public bool IsPublished { get; init; }
    public int[] TechnologyIds { get; init; } = [];
    public string[] Technologies { get; init; } = [];
}

public sealed class TechnologyResponse
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string? Icon { get; init; }
    public int DisplayOrder { get; init; }
    public bool IsVisible { get; init; }
}
