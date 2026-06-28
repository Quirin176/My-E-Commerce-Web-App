using WebApp_API.Infrastructure.OutputCache;

namespace WebApp_API.Infrastructure.Extensions
{
    public static class OutputCacheExtensions
    {
        public static IServiceCollection AddApplicationOutputCache(this IServiceCollection services)
        {
            services.AddOutputCache(options =>
            {
                ProductCachePolicies.Add(options);
                CategoryCachePolicies.Add(options);
                ProductOptionCachePolicies.Add(options);
            });

            return services;
        }
    }
}