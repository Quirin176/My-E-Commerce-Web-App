using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            // Category Slug is unique
            builder.HasIndex(c => c.Slug)
                   .IsUnique();
        }
    }
}