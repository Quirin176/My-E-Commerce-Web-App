using System.ComponentModel.DataAnnotations;

namespace WebApp_API.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required, MaxLength(150)] public string Name { get; set; }
        [Required, MaxLength(150)] public string Slug { get; set; }
    }
}
