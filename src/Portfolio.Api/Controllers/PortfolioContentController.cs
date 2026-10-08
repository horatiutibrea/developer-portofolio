using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.DTOs.Portfolio;
using Portfolio.Api.Services.Portfolio;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/portfolio")]
public class PortfolioContentController(PortfolioContentService content) : ControllerBase
{
    private readonly PortfolioContentService _content = content;

    [AllowAnonymous]
    [HttpGet("experiences")]
    public async Task<ActionResult> PublishedExperiences() => Ok(await _content.GetExperiencesAsync(true));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpGet("experiences/manage")]
    public async Task<ActionResult> ManageExperiences() => Ok(await _content.GetExperiencesAsync(false));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPost("experiences")]
    public Task<ActionResult> CreateExperience(ExperienceWriteDto request) => SaveExperience(null, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPut("experiences/{id:int}")]
    public Task<ActionResult> UpdateExperience(int id, ExperienceWriteDto request) => SaveExperience(id, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpDelete("experiences/{id:int}")]
    public Task<ActionResult> DeleteExperience(int id) => Delete(() => _content.DeleteExperienceAsync(id));

    [AllowAnonymous]
    [HttpGet("projects")]
    public async Task<ActionResult> PublishedProjects() => Ok(await _content.GetProjectsAsync(true));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpGet("projects/manage")]
    public async Task<ActionResult> ManageProjects() => Ok(await _content.GetProjectsAsync(false));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPost("projects")]
    public Task<ActionResult> CreateProject(ProjectWriteDto request) => SaveProject(null, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPut("projects/{id:int}")]
    public Task<ActionResult> UpdateProject(int id, ProjectWriteDto request) => SaveProject(id, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpDelete("projects/{id:int}")]
    public Task<ActionResult> DeleteProject(int id) => Delete(() => _content.DeleteProjectAsync(id));

    [AllowAnonymous]
    [HttpGet("technologies")]
    public async Task<ActionResult> VisibleTechnologies() => Ok(await _content.GetTechnologiesAsync(true));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpGet("technologies/manage")]
    public async Task<ActionResult> ManageTechnologies() => Ok(await _content.GetTechnologiesAsync(false));

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPost("technologies")]
    public Task<ActionResult> CreateTechnology(TechnologyWriteDto request) => SaveTechnology(null, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpPut("technologies/{id:int}")]
    public Task<ActionResult> UpdateTechnology(int id, TechnologyWriteDto request) => SaveTechnology(id, request);

    [Authorize(Roles = "SUPERADMIN")]
    [HttpDelete("technologies/{id:int}")]
    public Task<ActionResult> DeleteTechnology(int id) => Delete(() => _content.DeleteTechnologyAsync(id));

    private async Task<ActionResult> SaveExperience(int? id, ExperienceWriteDto request)
    {
        try
        {
            return Ok(await _content.SaveExperienceAsync(id, request));
        }
        catch (ContentRuleException exception)
        {
            return StatusCode(exception.Status, new { MessageKey = exception.MessageKey });
        }
    }

    private async Task<ActionResult> SaveProject(int? id, ProjectWriteDto request)
    {
        try
        {
            return Ok(await _content.SaveProjectAsync(id, request));
        }
        catch (ContentRuleException exception)
        {
            return StatusCode(exception.Status, new { MessageKey = exception.MessageKey });
        }
    }

    private async Task<ActionResult> SaveTechnology(int? id, TechnologyWriteDto request)
    {
        try
        {
            return Ok(await _content.SaveTechnologyAsync(id, request));
        }
        catch (ContentRuleException exception)
        {
            return StatusCode(exception.Status, new { MessageKey = exception.MessageKey });
        }
    }

    private async Task<ActionResult> Delete(Func<Task> action)
    {
        try
        {
            await action();
            return Ok(new { MessageKey = "api.contentDeleted" });
        }
        catch (ContentRuleException exception)
        {
            return StatusCode(exception.Status, new { MessageKey = exception.MessageKey });
        }
    }
}
