using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WebApp_API.Entities;

namespace WebApp_API.Data.Configurations
{
    public class ProductFilterConfiguration : IEntityTypeConfiguration<ProductFilter>
    {
        public void Configure(EntityTypeBuilder<ProductFilter> builder)
        {
            builder.HasOne(pf => pf.Product)
                .WithMany()
                .HasForeignKey(pf => pf.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(pf => pf.OptionValue)
                .WithMany()
                .HasForeignKey(pf => pf.OptionValueId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}