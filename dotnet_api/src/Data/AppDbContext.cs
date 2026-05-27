using Microsoft.EntityFrameworkCore;
using WebApp_API.Entities;
using WebApp_API.Data.Configurations;

namespace WebApp_API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductOption> ProductOptions { get; set; }
        public DbSet<ProductOptionValue> ProductOptionValues { get; set; }
        public DbSet<ProductFilter> ProductFilters { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductVariantOptionValue> ProductVariantOptionValues { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Apply configurations
            builder.ApplyConfiguration(new UserConfiguration());

            builder.ApplyConfiguration(new CategoryConfiguration());
            builder.ApplyConfiguration(new ProductOptionValueConfiguration());
            builder.ApplyConfiguration(new ProductFilterConfiguration());

            builder.ApplyConfiguration(new ProductConfiguration());
            builder.ApplyConfiguration(new ProductVariantConfiguration());
            builder.ApplyConfiguration(new ProductVariantOptionValueConfiguration());
            builder.ApplyConfiguration(new ProductImageConfiguration());

            builder.ApplyConfiguration(new OrderConfiguration());
            builder.ApplyConfiguration(new OrderItemConfiguration());
            
            builder.ApplyConfiguration(new ChatConfiguration());
            builder.ApplyConfiguration(new MessageConfiguration());

            base.OnModelCreating(builder);
        }
    }
}