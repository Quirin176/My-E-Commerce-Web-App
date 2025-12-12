using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Models;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductOptionsController(AppDbContext db) => _db = db;

        // POST: /api/product-options
        // Create a new ProductOption
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProductOption([FromBody] ProductOptionDTOs.CreateProductOptionRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Name))
                    return BadRequest(new { message = "Option name is required" });

                if (!req.CategoryId.HasValue || req.CategoryId <= 0)
                    return BadRequest(new { message = "Category ID is required" });

                // Check if category exists
                var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId.Value);
                if (!categoryExists)
                    return BadRequest(new { message = "Category does not exist" });

                // Check if option with same name already exists for this category
                var existingOption = await _db.ProductOptions
                    .FirstOrDefaultAsync(po => po.CategoryId == req.CategoryId.Value && po.Name == req.Name);
                
                if (existingOption != null)
                    return BadRequest(new { message = $"Option '{req.Name}' already exists for this category" });

                var newOption = new ProductOption
                {
                    Name = req.Name,
                    CategoryId = req.CategoryId.Value
                };

                _db.ProductOptions.Add(newOption);
                await _db.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductOption), new { id = newOption.Id }, new
                {
                    newOption.Id,
                    newOption.Name,
                    newOption.CategoryId,
                    OptionValues = new List<object>()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product option", error = ex.Message });
            }
        }

        // GET: /api/product-options/{id}
        // Get a specific ProductOption with its values
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductOption(int id)
        {
            try
            {
                var option = await _db.ProductOptions
                    .Include(po => po.ProductOptionValues)
                    .FirstOrDefaultAsync(po => po.Id == id);

                if (option == null)
                    return NotFound(new { message = "Product option not found" });

                return Ok(new
                {
                    option.Id,
                    option.Name,
                    option.CategoryId,
                    OptionValues = option.ProductOptionValues.Select(ov => new
                    {
                        ov.Id,
                        ov.Value
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving product option", error = ex.Message });
            }
        }

        // POST: /api/product-options/{optionId}/values
        // Add a new value to an existing ProductOption
        [HttpPost("{optionId}/values")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue(int optionId, [FromBody] ProductOptionDTOs.CreateOptionValueRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.Value))
                    return BadRequest(new { message = "Option value is required" });

                // Check if option exists
                var option = await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == optionId);
                if (option == null)
                    return NotFound(new { message = "Product option not found" });

                // Check if value already exists for this option
                var existingValue = await _db.ProductOptionValues
                    .FirstOrDefaultAsync(pov => pov.ProductOptionId == optionId && pov.Value == req.Value);
                
                if (existingValue != null)
                    return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });

                var newValue = new ProductOptionValue
                {
                    Value = req.Value,
                    ProductOptionId = optionId
                };

                _db.ProductOptionValues.Add(newValue);
                await _db.SaveChangesAsync();

                return CreatedAtAction(nameof(GetProductOption), new { id = optionId }, new
                {
                    newValue.Id,
                    newValue.Value,
                    newValue.ProductOptionId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating option value", error = ex.Message });
            }
        }
    }
}