using Microsoft.AspNetCore.OutputCaching;

namespace WebApp_API.Infrastructure.OutputCache
{
    public static class ProductOptionCachePolicies
    {
        public static void Add(OutputCacheOptions options)
        {
            options.AddPolicy("ProductOptionDetails", policy =>
            {
                policy.Tag("productoption-details")
                      .Expire(TimeSpan.FromMinutes(15))
                      .SetVaryByRouteValue("id");
            });

            options.AddPolicy("CategoryFiltersById", policy =>
            {
                policy.Tag("category-filters")
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("categoryId");
            });

            options.AddPolicy("CategoryFiltersBySlug", policy =>
            {
                policy.Tag("category-filters")
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("categorySlug");
            });
        }
    }
}