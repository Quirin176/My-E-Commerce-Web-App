using Microsoft.AspNetCore.OutputCaching;

namespace WebApp_API.Infrastructure.OutputCache
{
    public static class ProductCachePolicies
    {
        public const string ProductDetailsById = nameof(ProductDetailsById);
        public const string ProductDetailsBySlug = nameof(ProductDetailsBySlug);
        public const string ProductsNewest = nameof(ProductsNewest);
        public const string ProductsTopSelling = nameof(ProductsTopSelling);
        public const string ProductsSearch = nameof(ProductsSearch);
        public const string ProductsSuggestions = nameof(ProductsSuggestions);
        public const string ProductsPaginated = nameof(ProductsPaginated);
        public const string DeletedProductsPaginated = nameof(DeletedProductsPaginated);

        public const string ProductDetailsTag = "product-details";
        public const string ProductsListTag = "products-list";
        public const string ProductsSearchTag = "products-search";
        public const string ProductsSuggestionsTag = "products-suggestions";
        public const string ProductsPaginatedTag = "products-paginated";
        public const string DeletedProductsPaginatedTag = "deleted-products-paginated";

        public static void Add(OutputCacheOptions options)
        {
            options.AddPolicy(ProductDetailsById, policy =>
            {
                policy.Tag(ProductDetailsTag)
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("id");
            });

            options.AddPolicy(ProductDetailsBySlug, policy =>
            {
                policy.Tag(ProductDetailsTag)
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("slug");
            });
            
            options.AddPolicy(ProductsNewest, policy =>
                policy.Tag(ProductsListTag)
                      .Expire(TimeSpan.FromMinutes(5))
                      .SetVaryByQuery("categoryId",
                                      "amount"));

            options.AddPolicy(ProductsTopSelling, policy =>
                policy.Tag(ProductsListTag)
                      .Expire(TimeSpan.FromMinutes(5))
                      .SetVaryByQuery("categoryId",
                                      "amount"));

            options.AddPolicy(ProductsSearch, policy =>
                policy.Tag(ProductsSearchTag)
                      .Expire(TimeSpan.FromMinutes(5))
                      .SetVaryByQuery("queryPhrase",
                                      "page",
                                      "pageSize",
                                      "minPrice",
                                      "maxPrice",
                                      "sortOrder"));

            options.AddPolicy(ProductsSuggestions, policy =>
                policy.Tag(ProductsSuggestionsTag)
                      .Expire(TimeSpan.FromMinutes(1))
                      .SetVaryByQuery("q", "limit"));

            options.AddPolicy(ProductsPaginated, policy =>
                policy.Tag(ProductsPaginatedTag)
                      .Expire(TimeSpan.FromMinutes(5))
                      .SetVaryByQuery("category",
                                      "page",
                                      "pageSize",
                                      "minPrice",
                                      "maxPrice",
                                      "selectedOptions",
                                      "sortOrder",
                                      "search"));

            options.AddPolicy(DeletedProductsPaginated, policy =>
                policy.Tag(DeletedProductsPaginatedTag)
                      .Expire(TimeSpan.FromMinutes(5))
                      .SetVaryByQuery("category",
                                      "page",
                                      "pageSize",
                                      "minPrice",
                                      "maxPrice",
                                      "selectedOptions",
                                      "sortOrder",
                                      "search"));
        }
    }
}