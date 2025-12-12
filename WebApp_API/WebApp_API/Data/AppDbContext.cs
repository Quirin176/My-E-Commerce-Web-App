using Microsoft.EntityFrameworkCore;
using WebApp_API.Models;

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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
            builder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
            builder.Entity<ProductFilter>().HasOne(pf => pf.Product).WithMany().HasForeignKey(pf => pf.ProductId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ProductFilter>().HasOne(pf => pf.OptionValue).WithMany().HasForeignKey(pf => pf.OptionValueId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ProductOptionValue>().HasOne(v => v.ProductOption).WithMany().HasForeignKey(v => v.ProductOptionId).OnDelete(DeleteBehavior.Cascade);
            builder.Entity<ProductImage>().HasOne(pi => pi.Product).WithMany().HasForeignKey(pi => pi.ProductId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
