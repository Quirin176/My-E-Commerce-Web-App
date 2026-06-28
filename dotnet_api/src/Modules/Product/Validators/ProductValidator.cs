using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Repositories;
using WebApp_API.Modules.Categories.Repositories;
using WebApp_API.Modules.ProductOptionValues.Repositories;

namespace WebApp_API.Modules.Products.Validators
{
    public class ProductValidator
    {
        private readonly IProductRepository _productRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IProductOptionValueRepository _productOptionValueRepo;

        public ProductValidator(
            IProductRepository productRepo,
            ICategoryRepository categoryRepo,
            IProductOptionValueRepository productOptionValueRepo)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _productOptionValueRepo = productOptionValueRepo;
        }

        public async Task ValidateCreateAsync(ProductDTOs.CreateProductRequest request)
        {
            await ValidateCategoryExistsAsync(request.CategoryId);
            await ValidateSlugUniqueAsync(request.Slug);
            await ValidateOptionValuesAsync(request.CategoryId, request.SelectedOptionValueIds);
        }

        public async Task ValidateUpdateAsync(
            Entities.Product product,
            ProductDTOs.UpdateProductRequest request)
        {
            var categoryId = request.CategoryId ?? product.CategoryId;

            if (request.CategoryId.HasValue)
                await ValidateCategoryExistsAsync(categoryId);

            if (!string.IsNullOrWhiteSpace(request.Slug) &&
                request.Slug != product.Slug)
            {
                await ValidateSlugUniqueAsync(request.Slug);
            }

            if (request.SelectedOptionValueIds is not null)
            {
                await ValidateOptionValuesAsync(categoryId, request.SelectedOptionValueIds);
            }
        }

        private async Task ValidateCategoryExistsAsync(int categoryId)
        {
            if (!await _categoryRepo.CheckCategoryExistsByIdAsync(categoryId))
                throw new ArgumentException($"Category with ID {categoryId} does not exist.");
        }

        private async Task ValidateSlugUniqueAsync(string slug)
        {
            if (await _productRepo.CheckProductExistsBySlugAsync(slug))
                throw new InvalidOperationException(
                    $"A product with slug '{slug}' already exists.");
        }

        private async Task ValidateOptionValuesAsync(
            int categoryId,
            IReadOnlyCollection<int> optionValueIds)
        {
            if (optionValueIds.Count == 0) return;

            var valid = await _productOptionValueRepo.GetValidOptionValueIdsForCategoryAsync(categoryId);

            var invalid = optionValueIds.Except(valid).ToList();

            if (invalid.Count > 0)
            {
                throw new ArgumentException(
                    $"Option value ID(s) {string.Join(", ", invalid)} are not valid for this category.");
            }
        }
    }
}