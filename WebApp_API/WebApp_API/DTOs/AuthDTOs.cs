namespace WebApp_API.DTOs
{
    public class AuthDTOs
    {
        public class SignupRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Password { get; set; }
            public string Role { get; set; } = "Customer";
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
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
