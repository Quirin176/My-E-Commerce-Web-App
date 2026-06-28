using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;
using WebApp_API.Modules.ProductImages.Commands.AddProductImages;
using WebApp_API.Modules.ProductImages.Commands.DeleteProductImage;
using WebApp_API.Modules.ProductImages.Commands.RemoveProductImagesByProduct;
using WebApp_API.Modules.ProductImages.Commands.UpdateProductImage;
using WebApp_API.Modules.ProductImages.Queries.GetProductImageById;
using WebApp_API.Modules.ProductImages.Queries.GetProductImagesByProduct;
using WebApp_API.Modules.ProductImages.Queries.GetProductImagesByVariant;

namespace WebApp_API.Modules.ProductImages.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImagesController : ControllerBase // API Endpoint: /api/productimages
    {
        private readonly IMediator _mediator;
        public ProductImagesController(IMediator mediator) => _mediator = mediator;

        // GET /api/productimages/{id:int}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var img = await _mediator.Send(new GetProductImageByIdQuery(id));
            if (img == null) return NotFound();

            return Ok(img);
        }

        // GET /api/productimages/product/{productId:int}
        [HttpGet("product/{productId:int}")]
        public async Task<IActionResult> GetByProduct(int productId)
        {
            return Ok(await _mediator.Send(new GetProductImagesByProductQuery(productId)));
        }

        // GET /api/productimages/variant/{variantId:int}
        [HttpGet("variant/{variantId:int}")]
        public async Task<IActionResult> GetByVariant(int variantId)
        {
            return Ok(await _mediator.Send(new GetProductImagesByVariantQuery(variantId)));
        }

        // POST api/productimages/images - Accepts a list of image payloads and persists them.
        [HttpPost("images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddProductImages([FromBody] List<AddProductImageRequest> requests)
        {
            if (requests == null || requests.Count == 0)
                return BadRequest(new { message = "At least one image is required." });

            // Validate that each request targets exactly one of Product or Variant
            var invalid = requests.Where(r =>
                (r.ProductId == 0 && r.VariantId == 0) ||
                (r.ProductId != 0 && r.VariantId != 0)
            ).ToList();

            if (invalid.Count > 0)
                return BadRequest(new
                {
                    message = "Each image must target either a Product or a Variant, not both and not neither.",
                    invalidCount = invalid.Count
                });

            try
            {
                await _mediator.Send(new AddProductImagesCommand(requests));
                return Ok(new { message = $"{requests.Count} image(s) saved successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving images.", error = ex.Message });
            }
        }

        // PUT api/productimages/{id:int} - update image
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, ProductImageUpdateRequest dto)
        {
            // if (string.IsNullOrWhiteSpace(dto.ImageUrl)) return BadRequest(new { message = "Image URL is required." });

            var updated = await _mediator.Send(new UpdateProductImageCommand(id, dto));
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        // DELETE api/productimages/{id:int} - delete one
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteProductImageCommand(id));
            return success ? Ok() : NotFound();
        }

        // DELETE api/productimages/product/{productId:int} - delete all images of a product
        [HttpDelete("product/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteByProduct(int productId)
        {
            await _mediator.Send(new RemoveProductImagesByProductCommand(productId));
            return Ok();
        }
    }
}