using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.Property(m => m.Content)
                   .IsRequired();

            builder.Property(m => m.Type)
                   .IsRequired()
                   .HasMaxLength(20)
                   .HasDefaultValue("text");

            builder.Property(m => m.Read)
                   .IsRequired()
                   .HasDefaultValue(false);

            builder.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.NoAction);

            builder.HasIndex(m => m.ChatId);
            builder.HasIndex(m => m.SenderId);
            builder.HasIndex(m => m.CreatedAt);
        }
    }
}