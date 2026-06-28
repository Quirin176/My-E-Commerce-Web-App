using MediatR;
using WebApp_API.Modules.Categories.DTOs;
using WebApp_API.Modules.Categories.Repositories;

namespace WebApp_API.Modules.Categories.Queries.GetCategoryById
{
    public class GetCategoryByIdQueryHandler
        : IRequestHandler<GetCategoryByIdQuery, CategoryResponse?>
    {
        private readonly ICategoryRepository _repo;

        public GetCategoryByIdQueryHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<CategoryResponse?> Handle(
            GetCategoryByIdQuery request,
            CancellationToken cancellationToken)
        {
            var category = await _repo.GetCategoryByIdAsync(request.id);

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