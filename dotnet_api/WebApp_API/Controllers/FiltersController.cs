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
    public class FiltersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public FiltersController(AppDbContext db) => _db = db;

        // Get all filters/options for a category
        [HttpGet("category/{categorySlug}")]
        public async Task<IActionResult> GetFiltersByCategory(string categorySlug)
        {
            try
            {
                Console.WriteLine($"[Filters] GetFiltersByCategory called with slug: {categorySlug}");

                if (string.IsNullOrWhiteSpace(categorySlug))
                    return BadRequest(new { message = "Category slug is required" });

                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
                Console.WriteLine($"[Filters] Category found: {(category != null ? category.Name : "NULL")}");

                if (category == null)
                {
                    Console.WriteLine($"[Filters] Category with slug '{categorySlug}' not found. Returning empty list.");
                    return Ok(new List<object>());
                }

                Console.WriteLine($"[Filters] Category ID: {category.Id}");

                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == category.Id)
                    .ToListAsync();

                Console.WriteLine($"[Filters] Found {productOptions.Count} ProductOptions");

                var result = new List<object>();

                foreach (var option in productOptions)
                {
                    Console.WriteLine($"[Filters] Processing option: {option.Name} (ID: {option.Id})");

                    var optionValues = await _db.ProductOptionValues
                        .Where(ov => ov.ProductOptionId == option.Id)
                        .OrderBy(ov => ov.Value)
                        .Select(ov => new
                        {
                            optionValueId = ov.Id,
                            value = ov.Value
                        })
                        .ToListAsync();

                    Console.WriteLine($"[Filters] Option {option.Name} has {optionValues.Count} values");

                    result.Add(new
                    {
                        optionId = option.Id,
                        name = option.Name,
                        optionValues = optionValues
                    });
                }

                Console.WriteLine($"[Filters] Returning {result.Count} options with their values");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetFiltersByCategory exception: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // Get options by category ID (for admin form)
        [HttpGet("category-id/{categoryId}")]
        public async Task<IActionResult> GetFiltersByCategoryId(int categoryId)
        {
            try
            {
                Console.WriteLine($"[Filters] GetFiltersByCategoryId called with ID: {categoryId}");

                if (categoryId <= 0)
                    return BadRequest(new { message = "Valid category ID is required" });

                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
                Console.WriteLine($"[Filters] Category found: {(category != null ? category.Name : "NULL")}");

                if (category == null)
                    return Ok(new List<object>());

                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == categoryId)
                    .ToListAsync();

                Console.WriteLine($"[Filters] Found {productOptions.Count} ProductOptions");

                var result = new List<object>();

                foreach (var option in productOptions)
                {
                    var optionValues = await _db.ProductOptionValues
                        .Where(ov => ov.ProductOptionId == option.Id)
                        .OrderBy(ov => ov.Value)
                        .Select(ov => new
                        {
                            optionValueId = ov.Id,
                            value = ov.Value
                        })
                        .ToListAsync();

                    result.Add(new
                    {
                        optionId = option.Id,
                        name = option.Name,
                        optionValues = optionValues
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] GetFiltersByCategoryId exception: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // POST /api/filters/option-values - Add a new value to an existing ProductOption
        [HttpPost("option-values")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue([FromBody] ProductOptionDTOs.CreateOptionValueRequest req)
        {
            try
            {
                Console.WriteLine($"[OPTION] CreateOptionValue called");
                Console.WriteLine($"[OPTION] OptionId: {req.OptionId}, Value: {req.Value}");

                if (req.OptionId <= 0)
                    return BadRequest(new { message = "Valid option ID is required" });

                if (string.IsNullOrWhiteSpace(req.Value))
                    return BadRequest(new { message = "Option value is required" });

                // Check if option exists
                var option = await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == req.OptionId);
                if (option == null)
                {
                    Console.WriteLine($"[OPTION] Option not found: {req.OptionId}");
                    return NotFound(new { message = "Product option not found" });
                }

                Console.WriteLine($"[OPTION] Found option: {option.Name}");

                // Check if value already exists for this option
                var existingValue = await _db.ProductOptionValues
                    .FirstOrDefaultAsync(pov => pov.ProductOptionId == req.OptionId && pov.Value == req.Value);

                if (existingValue != null)
                {
                    Console.WriteLine($"[OPTION] Value already exists: {req.Value}");
                    return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });
                }

                var newValue = new ProductOptionValue
                {
                    Value = req.Value,
                    ProductOptionId = req.OptionId
                };

                _db.ProductOptionValues.Add(newValue);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[OPTION] Created new value: {newValue.Value} (ID: {newValue.Id})");

                return Ok(new
                {
                    newValue.Id,
                    newValue.Value,
                    newValue.ProductOptionId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OPTION] Error: {ex.Message}");
                Console.WriteLine($"[OPTION] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error creating option value", error = ex.Message });
            }
        }

        // PUT /api/filters/option-values/{id} - Update an existing option value
        [HttpPut("option-values/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateOptionValue(int id, [FromBody] ProductOptionDTOs.UpdateOptionValueRequest req)
        {
            try
            {
                Console.WriteLine($"[OPTION] UpdateOptionValue called with id: {id}");
                Console.WriteLine($"[OPTION] New value: {req.Value}");

                if (string.IsNullOrWhiteSpace(req.Value))
                    return BadRequest(new { message = "Option value is required" });

                // Find the option value
                var optionValue = await _db.ProductOptionValues.FirstOrDefaultAsync(pov => pov.Id == id);

                if (optionValue == null)
                {
                    Console.WriteLine($"[OPTION] Option value not found: {id}");
                    return NotFound(new { message = "Option value not found" });
                }

                Console.WriteLine($"[OPTION] Found option value: {optionValue.Value}");

                // Check if another value with the same name already exists for this option
                var existingValue = await _db.ProductOptionValues
                    .FirstOrDefaultAsync(pov => pov.ProductOptionId == optionValue.ProductOptionId 
                        && pov.Value == req.Value 
                        && pov.Id != id);

                if (existingValue != null)
                {
                    Console.WriteLine($"[OPTION] Value already exists: {req.Value}");
                    return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });
                }

                // Update the value
                optionValue.Value = req.Value;

                _db.ProductOptionValues.Update(optionValue);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[OPTION] Successfully updated option value to: {optionValue.Value}");

                return Ok(new 
                { 
                    message = "Option value updated successfully",
                    id = optionValue.Id,
                    value = optionValue.Value,
                    optionId = optionValue.ProductOptionId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OPTION] Error updating option value: {ex.Message}");
                Console.WriteLine($"[OPTION] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error updating option value", error = ex.Message });
            }
        }

        // DELETE /api/filters/option-values/{id} - Delete a ProductOptionValue
        [HttpDelete("option-values/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteOptionValue(int id)
        {
            try
            {
                Console.WriteLine($"[OPTION] DeleteOptionValue called with id: {id}");

                // Find the option value
                var optionValue = await _db.ProductOptionValues.FirstOrDefaultAsync(pov => pov.Id == id);

                if (optionValue == null)
                {
                    Console.WriteLine($"[OPTION] Option value not found: {id}");
                    return NotFound(new { message = "Option value not found" });
                }

                Console.WriteLine($"[OPTION] Found option value: {optionValue.Value}");

                // Check if this option value is used by any products
                var productCount = await _db.ProductFilters
                    .CountAsync(pf => pf.OptionValueId == id);

                if (productCount > 0)
                {
                    Console.WriteLine($"[OPTION] Cannot delete - used by {productCount} product(s)");
                    return BadRequest(new { message = $"Cannot delete this option value - it is used by {productCount} product(s)" });
                }

                // Delete the option value
                _db.ProductOptionValues.Remove(optionValue);
                await _db.SaveChangesAsync();

                Console.WriteLine($"[OPTION] Successfully deleted option value: {optionValue.Value}");

                return Ok(new { message = $"Option value '{optionValue.Value}' deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[OPTION] Error deleting option value: {ex.Message}");
                Console.WriteLine($"[OPTION] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error deleting option value", error = ex.Message });
            }
        }
    }
}
