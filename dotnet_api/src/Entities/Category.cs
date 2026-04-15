using System.ComponentModel.DataAnnotations;

namespace WebApp_API.Entities
{
    public class Category
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(150)] public required string Name { get; set; }
        [Required, MaxLength(150)] public required string Slug { get; set; }
    }
}
