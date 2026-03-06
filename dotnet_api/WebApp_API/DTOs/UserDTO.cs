namespace WebApp_API.DTOs
{
    public class UserDTOs
    {
        public class ProfileRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
            public required string Role { get; set; }
            public required DateTime CreatedAt { get; set; }
        }

        public class ProfileUpdateRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
        }
    }
}
