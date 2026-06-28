using MediatR;
using WebApp_API.Modules.Categories.DTOs;
using WebApp_API.Modules.Categories.Repositories;

namespace WebApp_API.Modules.Categories.Queries.GetAllCategories
{
    public class GetCategoryByIdQueryHandler
        : IRequestHandler<GetAllCategoriesQuery, List<CategoryResponse>>
    {
        private readonly ICategoryRepository _repo;

        public GetCategoryByIdQueryHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<CategoryResponse>> Handle(
            GetAllCategoriesQuery request,
            CancellationToken cancellationToken)
        {
            var categories = await _repo.GetAllCategoriesAsync();

            return categories.Select(category => new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug
            }).ToList();
        }
    }
}