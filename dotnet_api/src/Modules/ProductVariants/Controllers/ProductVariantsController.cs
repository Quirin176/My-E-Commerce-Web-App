using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using WebApp_API.Modules.ProductVariants.DTOs;
using WebApp_API.Modules.ProductVariants.Commands.CreateProductVariant;
using WebApp_API.Modules.ProductVariants.Commands.DeleteProductVariant;
using WebApp_API.Modules.ProductVariants.Commands.UpdateProductVariant;
using WebApp_API.Modules.ProductVariants.Queries.GetProductVariantById;
using WebApp_API.Modules.ProductVariants.Queries.GetProductVariantsByProductId;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantsController : ControllerBase // API URL: /api/productvariants
    {
        private readonly IMediator _mediator;
        public ProductVariantsController(IMediator mediator) => _mediator = mediator;

        // GET /api/productvariants/id/{id}
        [HttpGet("id/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var variant = await _mediator.Send(new GetProductVariantByIdQuery(id));
            return variant == null ? NotFound() : Ok(variant);
        }

        // GET /api/productvariants/product/{productId}
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProductId(int productId)
        {
            return Ok(await _mediator.Send(new GetProductVariantsByProductIdQuery(productId)));
        }

        // POST /api/productvariants/product/variant/${productId} — create a single variant
        [HttpPost("product/variant/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(int productId, [FromBody] CreateProductVariantRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.VariantName))
                return BadRequest(new { message = "Variant name is required" });

            if (request.Price <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (request.ProductId <= 0)
                return BadRequest(new { message = "Valid product ID is required" });

            if (request.ProductId != productId)
                return BadRequest(new { message = "Product ID is not matched" });

            try
            {
                var created = await _mediator.Send(new CreateProductVariantCommand(request));
                return Ok(new { message = "Product Variant Created", id = created.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error creating variant",
                    error = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        // POST /api/productvariants/product/{productId} — create multiple variants at once
        // [HttpPost("product/{productId:int}")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> CreateVariants(
        //     int productId,
        //     [FromBody] IEnumerable<ProductVariantDTOs.CreateProductVariantRequest> requests)
        // {
        //     if (requests == null || !requests.Any())
        //         return BadRequest(new { message = "At least one variant is required" });

        //     // Stamp the productId from the route onto every request item
        //     var stamped = requests.Select(r =>
        //     {
        //         r.ProductId = productId;
        //         return r;
        //     }).ToList();

        //     // Basic validation across all variants before touching the DB
        //     foreach (var r in stamped)
        //     {
        //         if (string.IsNullOrWhiteSpace(r.VariantName))
        //             return BadRequest(new { message = $"Variant name is required for every variant" });

        //         if (r.Price <= 0)
        //             return BadRequest(new { message = $"Price must be > 0 for variant \"{r.VariantName}\"" });
        //     }

        //     try
        //     {
        //         await _service.CreateVariantsAsync(stamped);
        //         return Ok(new { message = $"{stamped.Count} variant(s) created successfully" });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Error creating variants", error = ex.Message });
        //     }
        // }

        // PUT /api/productvariants/{id} — update a single variant
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductVariantRequest request)
        {
            try
            {
                var updated = await _mediator.Send(new UpdateProductVariantCommand(id, request));
                return updated is null ? NotFound() : Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating variant", error = ex.Message });
            }
        }

        // DELETE /api/productvariants/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteProductVariantCommand(id));
            return success ? NoContent() : NotFound();
        }
    }
}