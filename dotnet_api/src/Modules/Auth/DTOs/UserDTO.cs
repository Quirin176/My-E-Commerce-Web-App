namespace WebApp_API.DTOs
{
    public class UserDTOs
    {
        
        // DTO for receiving request from frontend
        public class ProfileUpdateRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
        }

        // DTO for sending profile data to frontend
        public class ProfileResponse
        {
            public required int Id { get; set; }
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Phone { get; set; }
            public required string Role { get; set; }
            public required DateTime CreatedAt { get; set; }
        }

        // DTO for receiving filters params data from frontend
        public class UsersFiltersParams
        {
            public string? Role { get; set; }
            public string SortBy { get; set; } = "Id";
            public string SortOrder { get; set; } = "asc";
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 10;
            public string? Search { get; set; }
        }
    }
}
