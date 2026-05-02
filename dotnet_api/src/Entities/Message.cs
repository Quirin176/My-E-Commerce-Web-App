using System.Text.Json.Serialization;

namespace WebApp_API.Entities
{
    public class Message
    {
        public int Id { get; set; }

        public int ChatId { get; set; }                 // Foreign Key -> Chats.Id
        public int SenderId { get; set; }   // FK -> Users.Id
        public required string Content { get; set; }

        public string Type { get; set; } = "text";
        public bool Read { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Chat? Chat { get; set; }
    }
}