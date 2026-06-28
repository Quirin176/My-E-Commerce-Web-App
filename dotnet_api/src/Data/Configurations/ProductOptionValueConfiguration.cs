using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ProductOptionValueConfiguration : IEntityTypeConfiguration<ProductOptionValue>
    {
        public void Configure(EntityTypeBuilder<ProductOptionValue> builder)
        {
            builder.HasOne(v => v.ProductOption)
                .WithMany()
                .HasForeignKey(v => v.ProductOptionId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}