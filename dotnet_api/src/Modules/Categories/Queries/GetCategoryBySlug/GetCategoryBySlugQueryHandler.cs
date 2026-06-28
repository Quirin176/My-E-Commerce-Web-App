using MediatR;
using WebApp_API.Modules.Categories.DTOs;
using WebApp_API.Modules.Categories.Repositories;

namespace WebApp_API.Modules.Categories.Queries.GetCategoryBySlug
{
    public class GetCategoryBySlugQueryHandler
        : IRequestHandler<GetCategoryBySlugQuery, CategoryResponse?>
    {
        private readonly ICategoryRepository _repo;

        public GetCategoryBySlugQueryHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<CategoryResponse?> Handle(
            GetCategoryBySlugQuery request,
            CancellationToken cancellationToken)
        {
            var category = await _repo.GetCategoryBySlugAsync(request.slug);

            if (category is null) return null;

            return new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug
            };
        }
    }
}