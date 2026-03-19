namespace WebApp_API.DTOs
{
    public class AuthDTOs
    {
        // Received data for signup from client
        public class SignupRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
            public required string Password { get; set; }
            // Default role is "Customer"
        }

        // Received data for login from client
        public class LoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        // Data sent back to client after successful login
        public class AuthResponse
        {
            public string Token { get; set; } = string.Empty;
            public int Id { get; set; }
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Role { get; set; } = string.Empty;
        }
    }
}
