using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using WebApp_API.Infrastructure.OutputCache;

using MediatR;
using WebApp_API.Modules.Products.DTOs;
using WebApp_API.Modules.Products.Commands.CreateProduct;
using WebApp_API.Modules.Products.Commands.HardDeleteProduct;
using WebApp_API.Modules.Products.Commands.SoftDeleteMultipleProducts;
using WebApp_API.Modules.Products.Commands.SoftDeleteProduct;
using WebApp_API.Modules.Products.Commands.UpdateProduct;
using WebApp_API.Modules.Products.Queries.GetCategoryNewestProducts;
using WebApp_API.Modules.Products.Queries.GetPaginatedProducts;
using WebApp_API.Modules.Products.Queries.GetProductById;
using WebApp_API.Modules.Products.Queries.GetProductBySlug;
using WebApp_API.Modules.Products.Queries.GetProductSuggestions;
using WebApp_API.Modules.Products.Queries.GetSoftDeletedPaginatedProducts;
using WebApp_API.Modules.Products.Queries.GetTopSellingProducts;
using WebApp_API.Modules.Products.Queries.SearchProducts;
using WebApp_API.Modules.Products.Specifications;

namespace WebApp_API.Modules.Products.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase // API URL: /api/products
    {
        private readonly IMediator _mediator;
        private readonly IOutputCacheStore _cacheStore;

        public ProductsController(IMediator mediator, IOutputCacheStore cacheStore)
        {
            _mediator = mediator;
            _cacheStore = cacheStore;
        }

        private async Task EvictProductCachesAsync()
        {
            var cancellationToken = HttpContext.RequestAborted;

            await _cacheStore.EvictByTagAsync(ProductCachePolicies.ProductDetailsTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(ProductCachePolicies.ProductsListTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(ProductCachePolicies.ProductsSearchTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(ProductCachePolicies.ProductsSuggestionsTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(ProductCachePolicies.ProductsPaginatedTag, cancellationToken);
            await _cacheStore.EvictByTagAsync(ProductCachePolicies.DeletedProductsPaginatedTag, cancellationToken);
        }

        // GET /api/products/id:{id}
        [OutputCache(PolicyName = ProductCachePolicies.ProductDetailsById)]
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _mediator.Send(new GetProductByIdQuery(id));
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/slug/{slug}
        [OutputCache(PolicyName = ProductCachePolicies.ProductDetailsBySlug)]
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _mediator.Send(new GetProductBySlugQuery(slug));
            return product is null ? NotFound() : Ok(product);
        }

        // GET /api/products/newest
        [OutputCache(PolicyName = ProductCachePolicies.ProductsNewest)]
        [HttpGet("newest")]
        public async Task<IActionResult> GetCategoryNewestProducts([FromQuery] int categoryId, int amount)
        {
            var products = await _mediator.Send(new GetCategoryNewestProductsQuery(categoryId, amount));
            return Ok(products);
        }

        // GET /api/products/topselling
        [OutputCache(PolicyName = ProductCachePolicies.ProductsTopSelling)]
        [HttpGet("topselling")]
        public async Task<IActionResult> GetCategoryTopSellingProducts([FromQuery] int categoryId, int amount)
        {
            var products = await _mediator.Send(new GetTopSellingProductsQuery(categoryId, amount));
            return Ok(products);
        }

        // GET /api/products/search
        [HttpGet("search")]
        [OutputCache(PolicyName = ProductCachePolicies.ProductsSearch)]
        public async Task<IActionResult> SearchProducts([FromQuery] ProductListDTOs.ProductSearchParams searchParams)
        {
            if (string.IsNullOrWhiteSpace(searchParams.QueryPhrase))
                return BadRequest(new { message = "Search query is required" });

            var result = await _mediator.Send(new SearchProductsQuery(searchParams));
            return Ok(result);
        }

        // GET /api/products/search/suggestions
        [OutputCache(PolicyName = ProductCachePolicies.ProductsSuggestions)]
        [HttpGet("search/suggestions")]
        public async Task<IActionResult> GetSearchSuggestions([FromQuery] string q, [FromQuery] int limit = 10)
        {
            var suggestions = await _mediator.Send(new GetProductSuggestionsQuery(q, limit));
            return Ok(suggestions);
        }

        // GET /api/products/paginated
        [OutputCache(PolicyName = ProductCachePolicies.ProductsPaginated)]
        [HttpGet("paginated")]
        public async Task<IActionResult> GetProductsPaginated([FromQuery] ProductListDTOs.ProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);
            var result = await _mediator.Send(new GetPaginatedProductsQuery(spec));
            return Ok(result);
        }

        // GET /api/products/softdeleted/paginated
        [OutputCache(PolicyName = ProductCachePolicies.DeletedProductsPaginated)]
        [HttpGet("softdeleted/paginated")]
        public async Task<IActionResult> GetSoftDeletedProductsPaginated([FromQuery] ProductListDTOs.ProductFilterParams filterParams)
        {
            var spec = ProductFilterSpec.From(filterParams);
            var result = await _mediator.Send(new GetSoftDeletedPaginatedProductsQuery(spec));
            return Ok(result);
        }

        // ────────────────────────────────────────────────── Admin endpoints ──────────────────────────────────────────────────
        // POST /api/products - Create a new Product
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductDTOs.CreateProductRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Product Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Product Slug is required" });

            if (request.BasePrice <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (request.CategoryId <= 0)
                return BadRequest(new { message = "Category is required" });

            try
            {
                var createdId = await _mediator.Send(new CreateProductCommand(request));

                await EvictProductCachesAsync();

                return Ok(new { message = "Product Created", id = createdId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product", error = ex.Message });
            }
        }

        // PUT /api/products/{id} - Update an existing Product
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTOs.UpdateProductRequest request)
        {
            try
            {
                var updated = await _mediator.Send(new UpdateProductCommand(id, request));

                if (!updated) return NotFound();

                await EvictProductCachesAsync();

                return Ok(new { message = "Product updated", id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating product", error = ex.Message });
            }
        }

        // DELETE /api/products/soft/{id} - Soft delete a existing product
        [HttpDelete("soft/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SoftDeleteOne(int id)
        {
            var result = await _mediator.Send(new SoftDeleteProductCommand(id));

            if (result)
            {
                await EvictProductCachesAsync();
            }

            return result ? NoContent() : NotFound();
        }

        // DELETE /api/products/soft - Soft delete multiple existing products
        [HttpDelete("soft")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDTOs.BulkDeleteProductsResponse>> SoftDeleteMultiple(
            [FromBody] ProductDTOs.BulkDeleteProductsRequest request)
        {
            var result = await _mediator.Send(new SoftDeleteMultipleProductsCommand(request));

            if (result.DeletedCount > 0)
            {
                await EvictProductCachesAsync();
            }
            
            return Ok(result);
        }

        // DELETE /api/products/hard/{id} - Remove permanently an existing product from database
        [HttpDelete("hard/{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var deleted = await _mediator.Send(new HardDeleteProductCommand(id));

            if (deleted)
            {
                await EvictProductCachesAsync();
            }

            return deleted ? NoContent() : NotFound();
        }
    }
}