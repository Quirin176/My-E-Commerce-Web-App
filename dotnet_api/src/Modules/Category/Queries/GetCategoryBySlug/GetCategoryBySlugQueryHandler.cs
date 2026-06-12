using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Categories.Queries.GetCategoryBySlug
{
    public class GetCategoryBySlugQueryHandler
        : IRequestHandler<GetCategoryBySlugQuery, CategoryDTOs.CategoryResponse?>
    {
        private readonly ICategoryRepository _repo;

        public GetCategoryBySlugQueryHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<CategoryDTOs.CategoryResponse?> Handle(
            GetCategoryBySlugQuery request,
            CancellationToken cancellationToken)
        {
            var category = await _repo.GetCategoryBySlugAsync(request.slug);

            if (category is null) return null;

            return new CategoryDTOs.CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug
            };
        }
    }
}