using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;
using Portfolio.Api.DTOs.Portfolio;
using Portfolio.Api.Models.Portfolio;

namespace Portfolio.Api.Services.Portfolio;

public class PortfolioContentService(DataContext dataContext)
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<IReadOnlyList<ExperienceResponse>> GetExperiencesAsync(bool publishedOnly)
    {
        var query = _dataContext.Experiences.AsNoTracking().AsQueryable();
        if (publishedOnly)
            query = query.Where(item => item.IsPublished);
        var items = await query.OrderBy(item => item.DisplayOrder).ThenByDescending(item => item.StartDate).ToListAsync();
        return items.Select(MapExperience).ToList();
    }

    public async Task<ExperienceResponse> SaveExperienceAsync(int? id, ExperienceWriteDto request)
    {
        if (request.IsCurrent)
            request.EndDate = null;
        else if (request.EndDate is not null && request.EndDate < request.StartDate)
            throw new ContentRuleException(400, "api.validationFailed");

        var experience = id is null
            ? new Experience { Company = request.Company.Trim(), Position = request.Position.Trim() }
            : await _dataContext.Experiences.SingleOrDefaultAsync(item => item.Id == id.Value)
                ?? throw new ContentRuleException(404, "api.contentNotFound");
        if (id is null)
            _dataContext.Experiences.Add(experience);

        experience.Company = request.Company.Trim();
        experience.Position = request.Position.Trim();
        experience.Location = Clean(request.Location);
        experience.StartDate = request.StartDate;
        experience.EndDate = request.EndDate;
        experience.IsCurrent = request.IsCurrent;
        experience.Description = Clean(request.Description);
        experience.DisplayOrder = request.DisplayOrder;
        experience.IsPublished = request.IsPublished;
        await _dataContext.SaveChangesAsync();
        return MapExperience(experience);
    }

    public async Task DeleteExperienceAsync(int id)
    {
        var experience = await _dataContext.Experiences.SingleOrDefaultAsync(item => item.Id == id)
            ?? throw new ContentRuleException(404, "api.contentNotFound");
        _dataContext.Experiences.Remove(experience);
        await _dataContext.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<ProjectResponse>> GetProjectsAsync(bool publishedOnly)
    {
        var query = _dataContext.Projects.AsNoTracking()
            .Include(item => item.ProjectTechnologies).ThenInclude(item => item.Technology)
            .AsQueryable();
        if (publishedOnly)
            query = query.Where(item => item.IsPublished);
        var items = await query.OrderBy(item => item.DisplayOrder).ThenBy(item => item.Title).ToListAsync();
        return items.Select(MapProject).ToList();
    }

    public async Task<ProjectResponse> SaveProjectAsync(int? id, ProjectWriteDto request)
    {
        var slug = DataContext.NormalizeSlug(string.IsNullOrWhiteSpace(request.Slug) ? request.Title : request.Slug);
        if (string.IsNullOrWhiteSpace(slug))
            throw new ContentRuleException(400, "api.validationFailed");
        if (await _dataContext.Projects.AnyAsync(item => item.Slug == slug && item.Id != id))
            throw new ContentRuleException(409, "api.slugTaken");

        var technologyIds = request.TechnologyIds.Distinct().ToArray();
        var technologies = await _dataContext.Technologies.Where(item => technologyIds.Contains(item.Id)).ToListAsync();
        if (technologies.Count != technologyIds.Length)
            throw new ContentRuleException(400, "api.validationFailed");

        var project = id is null
            ? new Project { Title = request.Title.Trim(), Slug = slug, ShortDescription = request.ShortDescription.Trim() }
            : await _dataContext.Projects.Include(item => item.ProjectTechnologies)
                .SingleOrDefaultAsync(item => item.Id == id.Value)
                ?? throw new ContentRuleException(404, "api.contentNotFound");
        if (id is null)
            _dataContext.Projects.Add(project);

        project.Title = request.Title.Trim();
        project.Slug = slug;
        project.ShortDescription = request.ShortDescription.Trim();
        project.Description = Clean(request.Description);
        project.ImageUrl = Clean(request.ImageUrl);
        project.RepositoryUrl = Clean(request.RepositoryUrl);
        project.LiveUrl = Clean(request.LiveUrl);
        project.DisplayOrder = request.DisplayOrder;
        project.IsFeatured = request.IsFeatured;
        project.IsPublished = request.IsPublished;
        project.ProjectTechnologies.Clear();
        foreach (var technology in technologies)
            project.ProjectTechnologies.Add(new ProjectTechnology { Technology = technology });

        await _dataContext.SaveChangesAsync();
        await _dataContext.Entry(project).Collection(item => item.ProjectTechnologies).Query().Include(item => item.Technology).LoadAsync();
        return MapProject(project);
    }

    public async Task DeleteProjectAsync(int id)
    {
        var project = await _dataContext.Projects.SingleOrDefaultAsync(item => item.Id == id)
            ?? throw new ContentRuleException(404, "api.contentNotFound");
        _dataContext.Projects.Remove(project);
        await _dataContext.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<TechnologyResponse>> GetTechnologiesAsync(bool visibleOnly)
    {
        var query = _dataContext.Technologies.AsNoTracking().AsQueryable();
        if (visibleOnly)
            query = query.Where(item => item.IsVisible);
        var items = await query.OrderBy(item => item.DisplayOrder).ThenBy(item => item.Name).ToListAsync();
        return items.Select(MapTechnology).ToList();
    }

    public async Task<TechnologyResponse> SaveTechnologyAsync(int? id, TechnologyWriteDto request)
    {
        var name = request.Name.Trim();
        if (await _dataContext.Technologies.AnyAsync(item => item.Name == name && item.Id != id))
            throw new ContentRuleException(409, "api.nameTaken");

        var technology = id is null
            ? new Technology { Name = name, Category = request.Category.Trim() }
            : await _dataContext.Technologies.SingleOrDefaultAsync(item => item.Id == id.Value)
                ?? throw new ContentRuleException(404, "api.contentNotFound");
        if (id is null)
            _dataContext.Technologies.Add(technology);

        technology.Name = name;
        technology.Category = request.Category.Trim();
        technology.Icon = Clean(request.Icon);
        technology.DisplayOrder = request.DisplayOrder;
        technology.IsVisible = request.IsVisible;
        await _dataContext.SaveChangesAsync();
        return MapTechnology(technology);
    }

    public async Task DeleteTechnologyAsync(int id)
    {
        var technology = await _dataContext.Technologies.SingleOrDefaultAsync(item => item.Id == id)
            ?? throw new ContentRuleException(404, "api.contentNotFound");
        _dataContext.Technologies.Remove(technology);
        await _dataContext.SaveChangesAsync();
    }

    public static async Task SeedPublishedCatalogAsync(DataContext context)
    {
        if (!context.Database.IsRelational())
            return;
        if (await context.Projects.AnyAsync() || await context.Technologies.AnyAsync())
            return;

        var names = new[] { ".NET", "C#", "React", "TypeScript", "REST APIs", "PostgreSQL", "Docker", "Linux", "CI/CD" };
        var technologies = names.Select((name, index) => new Technology
        {
            Name = name,
            Category = "Stack",
            DisplayOrder = index,
            IsVisible = true,
        }).ToList();
        context.Technologies.AddRange(technologies);
        var project = new Project
        {
            Title = "Developer Portfolio",
            Slug = "developer-portfolio",
            ShortDescription = "A full-stack portfolio platform built to present projects, experience and technical work.",
            Description = "This website is developed as an end-to-end application, with a React and TypeScript interface, "
                + "a .NET API and PostgreSQL persistence, prepared for Linux deployment.",
            IsFeatured = true,
            IsPublished = true,
        };
        context.Projects.Add(project);
        await context.SaveChangesAsync();
        foreach (var name in new[] { ".NET", "React", "TypeScript", "PostgreSQL", "Linux" })
        {
            var technology = technologies.Single(item => item.Name == name);
            project.ProjectTechnologies.Add(new ProjectTechnology { TechnologyId = technology.Id });
        }
        await context.SaveChangesAsync();
    }

    private static ExperienceResponse MapExperience(Experience item) => new()
    {
        Id = item.Id,
        Company = item.Company,
        Position = item.Position,
        Location = item.Location,
        StartDate = item.StartDate,
        EndDate = item.EndDate,
        IsCurrent = item.IsCurrent,
        Description = item.Description,
        DisplayOrder = item.DisplayOrder,
        IsPublished = item.IsPublished,
    };

    private static ProjectResponse MapProject(Project item)
    {
        var technologies = item.ProjectTechnologies
            .Select(link => link.Technology)
            .Where(technology => technology is not null)
            .OrderBy(technology => technology.DisplayOrder)
            .ThenBy(technology => technology.Name)
            .ToList();
        return new ProjectResponse
        {
            Id = item.Id,
            Title = item.Title,
            Slug = item.Slug,
            ShortDescription = item.ShortDescription,
            Description = item.Description,
            ImageUrl = item.ImageUrl,
            RepositoryUrl = item.RepositoryUrl,
            LiveUrl = item.LiveUrl,
            DisplayOrder = item.DisplayOrder,
            IsFeatured = item.IsFeatured,
            IsPublished = item.IsPublished,
            TechnologyIds = technologies.Select(technology => technology.Id).ToArray(),
            Technologies = technologies.Select(technology => technology.Name).ToArray(),
        };
    }

    private static TechnologyResponse MapTechnology(Technology item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Category = item.Category,
        Icon = item.Icon,
        DisplayOrder = item.DisplayOrder,
        IsVisible = item.IsVisible,
    };

    private static string? Clean(string? value)
    {
        var trimmed = value?.Trim();
        return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }
}
