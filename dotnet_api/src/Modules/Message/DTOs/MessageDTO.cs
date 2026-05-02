namespace WebApp_API.DTOs
{
    public class MessageDto
    {
        public int ChatId { get; set; }
        public required string Content { get; set; }
    }

    public class MessageResponseDto
    {
        public int Id { get; set; }
        public int ChatId { get; set; }
        public int SenderId { get; set; }
        public string Content { get; set; } = "";
        public string Type { get; set; } = "text";
        public bool Read { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}