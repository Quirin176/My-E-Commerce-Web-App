namespace WebApp_API.Entities
{
    public class Chat
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }     // Foreign Key -> Users.Id
        public int? AdminId { get; set; }                // Foreign Key -> Users.Id

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "open";

        public List<Message> Messages { get; set; } = new();
    }
}