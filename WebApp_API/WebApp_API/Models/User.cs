using System.ComponentModel.DataAnnotations;

namespace WebApp_API.Models
{
    public class User
    {
        public int Id { get; set; }
        [MaxLength(200)] public string Username { get; set; }
        [Required, MaxLength(256)] public string Email { get; set; }
        [MaxLength(200)] public string Phone { get; set; }
        [Required] public string PasswordHash { get; set; }
        [MaxLength(50)] public string Role { get; set; } = "Customer";
        public DateTime CreatedAt { get; set; }
    }
}
