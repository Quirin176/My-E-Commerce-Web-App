using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ProductVariantOptionValueConfiguration : IEntityTypeConfiguration<ProductVariantOptionValue>
    {
        public void Configure(EntityTypeBuilder<ProductVariantOptionValue> builder)
        {
            builder.HasKey(x => new { x.ProductVariantId, x.ProductOptionValueId });

            builder.HasOne(pvov => pvov.ProductVariant)
                .WithMany(v => v.ProductVariantOptionValues)
                .HasForeignKey(pvov => pvov.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pvov => pvov.ProductOptionValue)
                .WithMany(ov => ov.ProductVariantOptionValues)
                .HasForeignKey(pvov => pvov.ProductOptionValueId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}