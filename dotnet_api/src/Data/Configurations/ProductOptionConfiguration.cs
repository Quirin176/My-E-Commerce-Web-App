using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ProductOptionConfiguration : IEntityTypeConfiguration<ProductOption>
    {
        public void Configure(EntityTypeBuilder<ProductOption> builder)
        {
            builder.HasOne(po => po.Category)
                   .WithMany()
                   .HasForeignKey(po => po.CategoryId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(po => po.CategoryId);

            builder.Property(po => po.Name)
                   .IsRequired()
                   .HasMaxLength(100);
        }
    }
}