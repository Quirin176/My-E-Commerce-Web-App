namespace WebApp_API.DTOs
{
    public class ProfileRequest
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
    }
}
