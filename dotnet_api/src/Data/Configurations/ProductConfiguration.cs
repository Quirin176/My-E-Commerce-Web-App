using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasIndex(p => p.Slug)
                   .IsUnique();

            builder.Property(p => p.Status)
                   .HasConversion<byte>();

            builder.HasQueryFilter(p => !p.IsDeleted);
        }
    }
}