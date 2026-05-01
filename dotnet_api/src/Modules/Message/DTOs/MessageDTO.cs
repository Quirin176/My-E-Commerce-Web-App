public class MessageDto
{
    public int ConversationId { get; set; }
    public int SenderId { get; set; }
    public required string Content { get; set; }
}