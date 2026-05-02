namespace WebApp_API.DTOs
{
    public class ChatResponseDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int? AdminId { get; set; }
        public string Status { get; set; } = "open";
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<MessageResponseDto> Messages { get; set; } = new();
    }
}