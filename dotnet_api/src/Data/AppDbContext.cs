using Microsoft.EntityFrameworkCore;
using WebApp_API.Entities;

namespace WebApp_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductOption> ProductOptions { get; set; }
        public DbSet<ProductOptionValue> ProductOptionValues { get; set; }
        public DbSet<ProductFilter> ProductFilters { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Defines the EF Core model
            // User Model
            builder.Entity<User>()
                .Property(u => u.Email)
                .IsRequired();

            builder.Entity<User>()
                .Property(u => u.Phone)
                .IsRequired();

            builder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            builder.Entity<User>()
                .HasIndex(u => u.Phone)
                .IsUnique();

            // Category Model
            builder.Entity<Category>()
                .HasIndex(c => c.Slug)
                .IsUnique();

            builder.Entity<Product>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            builder.Entity<ProductFilter>()
                .HasOne(pf => pf.Product)
                .WithMany()
                .HasForeignKey(pf => pf.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductFilter>()
                .HasOne(pf => pf.OptionValue)
                .WithMany()
                .HasForeignKey(pf => pf.OptionValueId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductOptionValue>()
                .HasOne(v => v.ProductOption)
                .WithMany()
                .HasForeignKey(v => v.ProductOptionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductImage>()
                .HasOne(pi => pi.Product)
                .WithMany()
                .HasForeignKey(pi => pi.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Create index for faster queries
            builder.Entity<Order>().HasIndex(o => o.UserId);
            builder.Entity<Order>().HasIndex(o => o.OrderDate);
            builder.Entity<Order>().HasIndex(o => o.Status);

            // Chat Model
            // Chat → Messages (1:N)
            builder.Entity<Chat>()
                .HasMany(c => c.Messages)
                .WithOne(m => m.Chat)
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.NoAction);

            // Chat.CustomerId → Users.Id
            builder.Entity<Chat>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            // Chat.AdminId → Users.Id
            builder.Entity<Chat>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.AdminId)
                .OnDelete(DeleteBehavior.NoAction);

            // Message.SenderId → Users.Id
            builder.Entity<Message>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.NoAction);

            // Indexes
            builder.Entity<Chat>().HasIndex(c => c.CustomerId);
            builder.Entity<Chat>().HasIndex(c => c.AdminId);

            builder.Entity<Message>().HasIndex(m => m.ChatId);
            builder.Entity<Message>().HasIndex(m => m.SenderId);
            builder.Entity<Message>().HasIndex(m => m.CreatedAt);
        }
    }
}
