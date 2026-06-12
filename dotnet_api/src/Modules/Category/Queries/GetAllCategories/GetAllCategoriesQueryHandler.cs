using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Categories.Queries.GetAllCategories
{
    public class GetCategoryByIdQueryHandler
        : IRequestHandler<GetAllCategoriesQuery, List<CategoryDTOs.CategoryResponse>>
    {
        private readonly ICategoryRepository _repo;

        public GetCategoryByIdQueryHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<CategoryDTOs.CategoryResponse>> Handle(
            GetAllCategoriesQuery request,
            CancellationToken cancellationToken)
        {
            var categories = await _repo.GetAllCategoriesAsync();

            return categories.Select(category => new CategoryDTOs.CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Slug = category.Slug
            }).ToList();
        }
    }
}