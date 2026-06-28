using Microsoft.AspNetCore.OutputCaching;

namespace WebApp_API.Infrastructure.OutputCache
{
    public static class CategoryCachePolicies
    {
        public const string CategoriesList = nameof(CategoriesList);
        public const string CategoryDetailsById = nameof(CategoryDetailsById);
        public const string CategoryDetailsBySlug = nameof(CategoryDetailsBySlug);

        public const string CategoriesListTag = "categories-list";
        public const string CategoryDetailsTag = "category-details";

        public static void Add(OutputCacheOptions options)
        {
            options.AddPolicy(CategoriesList, policy =>
                policy.Tag(CategoriesListTag)
                      .Expire(TimeSpan.FromMinutes(30)));

            options.AddPolicy(CategoryDetailsById, policy =>
                policy.Tag(CategoryDetailsTag)
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("id"));

            options.AddPolicy(CategoryDetailsBySlug, policy =>
                policy.Tag(CategoryDetailsTag)
                      .Expire(TimeSpan.FromMinutes(30))
                      .SetVaryByRouteValue("slug"));
        }
    }
}