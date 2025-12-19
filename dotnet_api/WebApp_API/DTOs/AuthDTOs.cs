namespace WebApp_API.DTOs
{
    public class AuthDTOs
    {
        public class SignupRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
            public required string Password { get; set; }
            public required string Role { get; set; } = "Customer";
        }

        public class LoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        public class AuthResponse
        {
            public string Token { get; set; }
            public int Id { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public DateTime CreatedAt { get; set; }
            public string Phone { get; set; }

            public AuthResponse(string token, int id, string username, string email, string phone, string role, DateTime createdAt)
            {
                Token = token;
                Id = id;
                Username = username;
                Email = email;
                Phone = phone;
                Role = role;
                CreatedAt = createdAt;
            }
        }
    }
}
