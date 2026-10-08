namespace Portfolio.Api.Models.Common
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        [System.ComponentModel.DataAnnotations.Timestamp]
        public uint RowVersion { get; set; }
    }
}
