using MediatR;
using WebApp_API.Entities;
using WebApp_API.Modules.Categories.Repositories;

namespace WebApp_API.Modules.Categories.Commands.AddCategory
{
    public class AddCategoryCommandHandler
        : IRequestHandler<AddCategoryCommand>
    {
        private readonly ICategoryRepository _repo;

        public AddCategoryCommandHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task Handle(AddCategoryCommand request, CancellationToken cancellationToken)
        {
            if (await _repo.GetCategoryBySlugAsync(request.Category.Slug) != null)
                throw new InvalidOperationException($"A category with slug '{request.Category.Slug}' already exists.");

            var category = new Category
            {
                Name = request.Category.Name,
                Slug = request.Category.Slug
            };

            await _repo.AddCategoryAsync(category);
        }
    }
}