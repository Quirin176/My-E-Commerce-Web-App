using MediatR;
using WebApp_API.DTOs;
using WebApp_API.Repositories;

namespace WebApp_API.Features.Categories.Commands.UpdateCategory
{
    public class UpdateCategoryCommandHandler
        : IRequestHandler<UpdateCategoryCommand, bool>
    {
        private readonly ICategoryRepository _repo;

        public UpdateCategoryCommandHandler(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(
            UpdateCategoryCommand request,
            CancellationToken cancellationToken)
        {
            // Validate category existence
            var category = await _repo.GetCategoryByIdAsync(request.updateRequest.Id);

            if (category is null) return false; // Not found existing category

            // Check slug uniqueness only if it's changing
            if (category.Slug != request.updateRequest.Slug &&
                await _repo.GetCategoryBySlugAsync(request.updateRequest.Slug) != null)
            {
                throw new InvalidOperationException(
                    $"A category with slug '{request.updateRequest.Slug}' already exists.");
            }

            category.Name = request.updateRequest.Name;
            category.Slug = request.updateRequest.Slug;

            await _repo.UpdateAsync(category);

            return true;
        }
    }
}