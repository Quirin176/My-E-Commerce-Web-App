using System.ComponentModel.DataAnnotations;

namespace WebApp_API.DTOs
{
    public class AuthDTOs
    {
        // Received data for signup from client
        public class SignupRequest
        {
            [Required(ErrorMessage = "Username is required")]
            [StringLength(50, MinimumLength = 3)]
            public required string Username { get; set; }

            [Required(ErrorMessage = "Email is required")]
            [EmailAddress(ErrorMessage = "Invalid email format")]
            public required string Email { get; set; }

            [Required]
            [Phone(ErrorMessage = "Invalid phone number")]
            public required string Phone { get; set; }

            [Required]
            [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
            public required string Password { get; set; }
            // Default role is "Customer"
        }

        // Received data for login from client
        public class LoginRequest
        {
            [Required]
            [EmailAddress]
            public required string Email { get; set; }

            [Required]
            public required string Password { get; set; }
        }

        // Data sent back to client after successful login
        public class AuthResponse
        {
            public string Token { get; set; } = string.Empty;
            public int Id { get; set; }
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Role { get; set; } = "Customer";
        }
    }
}
