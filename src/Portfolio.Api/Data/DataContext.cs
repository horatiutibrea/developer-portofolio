using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Api.Models.Common;
using Portfolio.Api.Models.Identity;
using Portfolio.Api.Models.Portfolio;
using System.Text;

namespace Portfolio.Api.Data;

public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
{
    private static readonly DateTimeOffset RoleSeedTimestamp =
        new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<PageContent> PageContents { get; set; } = null!;
    public DbSet<Experience> Experiences { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<Technology> Technologies { get; set; } = null!;
    public DbSet<ProjectTechnology> ProjectTechnologies { get; set; } = null!;
    public DbSet<Consent> Consents { get; set; } = null!;
    public DbSet<ContactMessage> ContactMessages { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureUser(modelBuilder.Entity<User>());
        ConfigureRole(modelBuilder.Entity<Role>());
        ConfigureUserRole(modelBuilder.Entity<UserRole>());
        ConfigurePageContent(modelBuilder.Entity<PageContent>());
        ConfigureExperience(modelBuilder.Entity<Experience>());
        ConfigureProject(modelBuilder.Entity<Project>());
        ConfigureTechnology(modelBuilder.Entity<Technology>());
        ConfigureProjectTechnology(modelBuilder.Entity<ProjectTechnology>());
        ConfigureConsent(modelBuilder.Entity<Consent>());
        ConfigureContactMessage(modelBuilder.Entity<ContactMessage>());
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        PrepareChanges();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(
        bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = default)
    {
        PrepareChanges();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private static void ConfigureUser(EntityTypeBuilder<User> entity)
    {
        entity.ToTable("Users");
        ConfigureIdentityBase(entity);

        entity.Property(item => item.Email).HasMaxLength(255).IsRequired();
        entity.Property(item => item.FirstName).HasMaxLength(200).IsRequired();
        entity.Property(item => item.LastName).HasMaxLength(200).IsRequired();
        entity.Property(item => item.ProfilePictureUrl).HasMaxLength(1000);
        entity.Property(item => item.GoogleSubject).HasMaxLength(255);
        entity.Property(item => item.SecurityStamp).IsRequired();
        entity.Property(item => item.IsLocked).HasDefaultValue(false);
        entity.Property(item => item.LastLoginAt);

        entity.HasIndex(item => item.Email).IsUnique();
        entity.HasIndex(item => item.GoogleSubject)
                .IsUnique();
        entity.HasMany(item => item.Roles)
            .WithMany(item => item.Users)
            .UsingEntity<UserRole>();
    }

    private static void ConfigureRole(EntityTypeBuilder<Role> entity)
    {
        entity.ToTable("Roles");
        ConfigureIdentityBase(entity);

        entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
        entity.Property(item => item.IsActive).HasDefaultValue(true);
        entity.Property(item => item.Priority).IsRequired();
        entity.HasIndex(item => item.Name).IsUnique();

        entity.HasData(
            new Role
            {
                Id = 1,
                Name = "SUPERADMIN",
                IsActive = true,
                Priority = 0,
                CreatedAt = RoleSeedTimestamp,
                UpdatedAt = RoleSeedTimestamp
            },
            new Role
            {
                Id = 2,
                Name = "ADMIN",
                IsActive = true,
                Priority = 1,
                CreatedAt = RoleSeedTimestamp,
                UpdatedAt = RoleSeedTimestamp
            },
            new Role
            {
                Id = 3,
                Name = "USER",
                IsActive = true,
                Priority = 100,
                CreatedAt = RoleSeedTimestamp,
                UpdatedAt = RoleSeedTimestamp
            });
    }

    private static void ConfigureUserRole(EntityTypeBuilder<UserRole> entity)
    {
        entity.ToTable("UserRoles");
        entity.HasKey(item => new { item.RoleId, item.UserId });
        entity.Property(item => item.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(item => item.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.HasIndex(item => item.UserId);

        entity.HasOne(item => item.User)
            .WithMany(item => item.UserRoles)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(item => item.Role)
            .WithMany(item => item.UserRoles)
            .HasForeignKey(item => item.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

    }

    private static void ConfigurePageContent(EntityTypeBuilder<PageContent> entity)
    {
        entity.ToTable("PageContents");
        ConfigureAuditable(entity);
        entity.Property(item => item.Key).HasMaxLength(100).IsRequired();
        entity.Property(item => item.Title).HasMaxLength(250);
        entity.Property(item => item.Subtitle).HasMaxLength(500);
        entity.Property(item => item.Content);
        entity.Property(item => item.IsPublished).HasDefaultValue(true);
        entity.HasIndex(item => item.Key).IsUnique();
        entity.HasIndex(item => item.UpdatedByUserId);
        entity.HasOne(item => item.UpdatedByUser)
            .WithMany(item => item.UpdatedPageContents)
            .HasForeignKey(item => item.UpdatedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }

    private static void ConfigureExperience(EntityTypeBuilder<Experience> entity)
    {
        entity.ToTable("Experiences", table =>
        {
            table.HasCheckConstraint(
                "CK_Experiences_CurrentHasNoEndDate",
                "\"IsCurrent\" = FALSE OR \"EndDate\" IS NULL");

            table.HasCheckConstraint(
                "CK_Experiences_EndDateNotBeforeStartDate",
                "\"EndDate\" IS NULL OR \"EndDate\" >= \"StartDate\"");
        });
        ConfigureAuditable(entity);
        entity.Property(item => item.Company).HasMaxLength(200).IsRequired();
        entity.Property(item => item.Position).HasMaxLength(200).IsRequired();
        entity.Property(item => item.Location).HasMaxLength(200);
        entity.Property(item => item.StartDate).HasColumnType("date");
        entity.Property(item => item.EndDate).HasColumnType("date");
        entity.Property(item => item.Description);
        entity.Property(item => item.IsPublished).HasDefaultValue(true);
        entity.HasIndex(item => new { item.IsPublished, item.DisplayOrder });
    }

    private static void ConfigureProject(EntityTypeBuilder<Project> entity)
    {
        entity.ToTable("Projects");
        ConfigureAuditable(entity);
        entity.Property(item => item.Title).HasMaxLength(200).IsRequired();
        entity.Property(item => item.Slug).HasMaxLength(200).IsRequired();
        entity.Property(item => item.ShortDescription).HasMaxLength(500).IsRequired();
        entity.Property(item => item.Description);
        entity.Property(item => item.ImageUrl).HasMaxLength(1000);
        entity.Property(item => item.RepositoryUrl).HasMaxLength(1000);
        entity.Property(item => item.LiveUrl).HasMaxLength(1000);
        entity.Property(item => item.IsFeatured).HasDefaultValue(false);
        entity.Property(item => item.IsPublished).HasDefaultValue(true);
        entity.HasIndex(item => item.Slug).IsUnique();
        entity.HasIndex(item => new { item.IsPublished, item.DisplayOrder });
    }

    private static void ConfigureTechnology(EntityTypeBuilder<Technology> entity)
    {
        entity.ToTable("Technologies");
        ConfigureAuditable(entity);
        entity.Property(item => item.Name).HasMaxLength(100).IsRequired();
        entity.Property(item => item.Category).HasMaxLength(100).IsRequired();
        entity.Property(item => item.Icon).HasMaxLength(100);
        entity.Property(item => item.IsVisible).HasDefaultValue(true);
        entity.HasIndex(item => item.Name).IsUnique();
        entity.HasIndex(item => new { item.IsVisible, item.DisplayOrder });
    }

    private static void ConfigureProjectTechnology(EntityTypeBuilder<ProjectTechnology> entity)
    {
        entity.ToTable("ProjectTechnologies");
        entity.HasKey(item => new { item.ProjectId, item.TechnologyId });
        entity.HasIndex(item => item.TechnologyId);
        entity.HasOne(item => item.Project)
            .WithMany(item => item.ProjectTechnologies)
            .HasForeignKey(item => item.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
        entity.HasOne(item => item.Technology)
            .WithMany(item => item.ProjectTechnologies)
            .HasForeignKey(item => item.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static void ConfigureConsent(EntityTypeBuilder<Consent> entity)
    {
        entity.ToTable("Consents");
        entity.Property(item => item.Type).HasConversion<int>();
        entity.Property(item => item.PolicyVersion).HasMaxLength(50).IsRequired();
        entity.Property(item => item.AcceptedAt);
        entity.Property(item => item.RevokedAt);
        entity.HasIndex(item => new { item.UserId, item.Type, item.AcceptedAt });
        entity.HasIndex(item => new { item.Type, item.PolicyVersion });
        entity.HasOne(item => item.User)
            .WithMany(item => item.Consents)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    private static void ConfigureContactMessage(EntityTypeBuilder<ContactMessage> entity)
    {
        entity.ToTable("ContactMessages");
        entity.Property(item => item.Subject).HasMaxLength(250).IsRequired();
        entity.Property(item => item.Message).HasMaxLength(4000).IsRequired();
        entity.Property(item => item.Status)
            .HasConversion<int>()
            .HasDefaultValue(ContactMessageStatus.New);
        entity.Property(item => item.CreatedAt);
        entity.Property(item => item.ReadAt);
        entity.Property(item => item.ResolvedAt);
        entity.HasIndex(item => new { item.Status, item.CreatedAt });
        entity.HasIndex(item => new { item.UserId, item.CreatedAt });
        entity.HasIndex(item => item.ConsentId).IsUnique();
        entity.HasOne(item => item.User)
            .WithMany(item => item.ContactMessages)
            .HasForeignKey(item => item.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        entity.HasOne(item => item.Consent)
            .WithOne(item => item.ContactMessage)
            .HasForeignKey<ContactMessage>(item => item.ConsentId)
            .OnDelete(DeleteBehavior.NoAction);
    }

    private static void ConfigureIdentityBase<TEntity>(EntityTypeBuilder<TEntity> entity)
        where TEntity : BaseEntity
    {
        entity.Property(item => item.CreatedAt)
        .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(item => item.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(item => item.RowVersion).IsRowVersion();
    }

    private static void ConfigureAuditable<TEntity>(EntityTypeBuilder<TEntity> entity)
        where TEntity : AuditableEntity
    {
        entity.Property(item => item.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        entity.Property(item => item.UpdatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }

    private void PrepareChanges()
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<UserRole>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        foreach (var entry in ChangeTracker.Entries<User>()
            .Where(item => item.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.Email = NormalizeEmail(entry.Entity.Email);
        }

        foreach (var entry in ChangeTracker.Entries<PageContent>()
            .Where(item => item.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.Key = entry.Entity.Key.Trim().ToLowerInvariant();
        }

        foreach (var entry in ChangeTracker.Entries<Project>()
            .Where(item => item.State is EntityState.Added or EntityState.Modified))
        {
            entry.Entity.Slug = NormalizeSlug(entry.Entity.Slug);
        }

        foreach (var entry in ChangeTracker.Entries<Consent>()
            .Where(item => item.State == EntityState.Added && item.Entity.AcceptedAt == default))
        {
            entry.Entity.AcceptedAt = now;
        }

        foreach (var entry in ChangeTracker.Entries<ContactMessage>()
            .Where(item => item.State == EntityState.Added && item.Entity.CreatedAt == default))
        {
            entry.Entity.CreatedAt = now;
        }
    }

    public static string NormalizeEmail(string email) =>
        email.Trim().ToLowerInvariant();

    public static string NormalizeSlug(string slug)
    {
        var source = slug.Trim().ToLowerInvariant();
        var result = new StringBuilder(source.Length);
        var separatorPending = false;

        foreach (var character in source)
        {
            if (char.IsLetterOrDigit(character))
            {
                if (separatorPending && result.Length > 0)
                {
                    result.Append('-');
                }
                result.Append(character);
                separatorPending = false;
            }
            else if (result.Length > 0)
            {
                separatorPending = true;
            }
        }

        return result.ToString();
    }
}
