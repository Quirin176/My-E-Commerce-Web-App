using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Entities;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionValuesController : ControllerBase // API Endpoint: /api/productoptionvalues
    {
        // private readonly AppDbContext _db;
        // public ProductOptionValuesController(AppDbContext db) => _db = db;

        private readonly IProductOptionValueService _service;
        public ProductOptionValuesController(IProductOptionValueService service) => _service = service;

        // POST: api/productoptionvalues/optionvalues - Add a new value to an existing ProductOption
        [HttpPost("optionvalues")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue([FromBody] ProductOptionValueDTOs.CreateOptionValueRequest request)
        {
            if (request.OptionId <= 0)
                return BadRequest(new { message = "Valid option ID is required" });

            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                // // Check if option exists
                // var option = await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == req.OptionId);
                // if (option == null)
                // {
                //     return NotFound(new { message = "Product option not found" });
                // }

                // // Check if value already exists for this option
                // var existingValue = await _db.ProductOptionValues
                //     .FirstOrDefaultAsync(pov => pov.ProductOptionId == req.OptionId && pov.Value == req.Value);

                // if (existingValue != null)
                // {
                //     return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });
                // }

                // var newValue = new ProductOptionValue
                // {
                //     Value = req.Value,
                //     ProductOptionId = req.OptionId
                // };

                // _db.ProductOptionValues.Add(newValue);
                // await _db.SaveChangesAsync();

                // return Ok(new
                // {
                //     newValue.Id,
                //     newValue.Value,
                //     newValue.ProductOptionId
                // });
                await _service.CreateProductOptionValueAsync(request);
                return Ok(new { message = "Option Value created" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating option value", error = ex.Message });
            }
        }

        // PUT: api/productoptionvalues/optionvalues/{id} - Update an existing option value
        [HttpPut("optionvalues/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOptionValue(int id, [FromBody] ProductOptionValueDTOs.UpdateOptionValueRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Value))
                return BadRequest(new { message = "Option value is required" });

            try
            {
                // // Find the option value
                // var optionValue = await _db.ProductOptionValues.FirstOrDefaultAsync(pov => pov.Id == id);

                // if (optionValue == null)
                // {
                //     return NotFound(new { message = "Option value not found" });
                // }

                // // Check if another value with the same name already exists for this option
                // var existingValue = await _db.ProductOptionValues
                //     .FirstOrDefaultAsync(pov => pov.ProductOptionId == optionValue.ProductOptionId
                //         && pov.Value == req.Value
                //         && pov.Id != id);

                // if (existingValue != null)
                // {
                //     return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });
                // }

                // // Update the value
                // optionValue.Value = req.Value;

                // _db.ProductOptionValues.Update(optionValue);
                // await _db.SaveChangesAsync();

                // return Ok(new
                // {
                //     message = "Option value updated successfully",
                //     id = optionValue.Id,
                //     value = optionValue.Value,
                //     optionId = optionValue.ProductOptionId
                // });
                await _service.UpdateProductOptionValueAsync(id, request);
                return Ok(new { message = "Option value updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating option value", error = ex.Message });
            }
        }

        // DELETE: api/productoptionvalues/optionvalues/{id} - Delete a ProductOptionValue
        [HttpDelete("optionvalues/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOptionValue(int id)
        {
            try
            {
                // // Find the option value
                // var optionValue = await _db.ProductOptionValues.FirstOrDefaultAsync(pov => pov.Id == id);

                // if (optionValue == null)
                // {
                //     return NotFound(new { message = "Option value not found" });
                // }

                // // Check if this option value is used by any products
                // var productCount = await _db.ProductFilters
                //     .CountAsync(pf => pf.OptionValueId == id);

                // if (productCount > 0)
                // {
                //     return BadRequest(new { message = $"Cannot delete this option value - it is used by {productCount} product(s)" });
                // }

                // // Delete the option value
                // _db.ProductOptionValues.Remove(optionValue);
                // await _db.SaveChangesAsync();

                await _service.DeleteProductOptionValueAsync(id);
                return Ok(new { message = "Option value deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting option value", error = ex.Message });
            }
        }
    }
}
