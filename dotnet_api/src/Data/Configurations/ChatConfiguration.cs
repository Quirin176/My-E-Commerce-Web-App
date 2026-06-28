using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ChatConfiguration : IEntityTypeConfiguration<Chat>
    {
        public void Configure(EntityTypeBuilder<Chat> builder)
        {
            builder.HasMany(c => c.Messages)
                   .WithOne(m => m.Chat)
                   .HasForeignKey(m => m.ChatId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(c => c.CustomerId)
                    .OnDelete(DeleteBehavior.NoAction);

            // Chat.AdminId → Users.Id
            builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(c => c.AdminId)
                    .OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(c => c.CustomerId);
            builder.HasIndex(c => c.AdminId);
        }
    }
}