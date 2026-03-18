using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionsController : ControllerBase  // API Endpoint: /api/productoptions
    {
        private readonly AppDbContext _db;

        public ProductOptionsController(AppDbContext db) => _db = db;

        // GET: api/productoptions/category/slug/{categorySlug} - Get all options and all their optionvalues for a category by slug
        [HttpGet("category/slug/{categorySlug}")]
        public async Task<IActionResult> GetFiltersByCategory(string categorySlug)
        {
            try
            {
                // Console.WriteLine($"[Filters] GetFiltersByCategory called with slug: {categorySlug}");

                if (string.IsNullOrWhiteSpace(categorySlug))
                    return BadRequest(new { message = "Category slug is required" });

                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
                // Console.WriteLine($"[Filters] Category found: {(category != null ? category.Name : "NULL")}");

                if (category == null)
                {
                    // Console.WriteLine($"[Filters] Category with slug '{categorySlug}' not found. Returning empty list.");
                    return Ok(new List<object>());
                }

                // Console.WriteLine($"[Filters] Category ID: {category.Id}");

                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == category.Id)
                    .ToListAsync();

                // Console.WriteLine($"[Filters] Found {productOptions.Count} ProductOptions");

                var result = new List<object>();

                foreach (var option in productOptions)
                {
                    // Console.WriteLine($"[Filters] Processing option: {option.Name} (ID: {option.Id})");

                    var optionValues = await _db.ProductOptionValues
                        .Where(ov => ov.ProductOptionId == option.Id)
                        .OrderBy(ov => ov.Value)
                        .Select(ov => new
                        {
                            optionValueId = ov.Id,
                            value = ov.Value
                        })
                        .ToListAsync();

                    // Console.WriteLine($"[Filters] Option {option.Name} has {optionValues.Count} values");

                    result.Add(new
                    {
                        optionId = option.Id,
                        optionName = option.Name,
                        optionValues = optionValues
                    });
                }

                // Console.WriteLine($"[Filters] Returning {result.Count} options with their values");
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"[ERROR] GetFiltersByCategory exception: {ex.Message}");
                // Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // GET: api/productoptions/category/id/{categoryId} - Get all options and all their optionvalues for a category by ID
        [HttpGet("category/id/{categoryId}")]
        public async Task<IActionResult> GetFiltersByCategoryId(int categoryId)
        {
            try
            {
                // Console.WriteLine($"[Filters] GetFiltersByCategoryId called with ID: {categoryId}");

                if (categoryId <= 0)
                    return BadRequest(new { message = "Valid category ID is required" });

                var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
                // Console.WriteLine($"[Filters] Category found: {(category != null ? category.Name : "NULL")}");

                if (category == null)
                    return Ok(new List<object>());

                var productOptions = await _db.ProductOptions
                    .Where(o => o.CategoryId == categoryId)
                    .ToListAsync();

                // Console.WriteLine($"[Filters] Found {productOptions.Count} ProductOptions");

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
                        optionName = option.Name,
                        optionValues = optionValues
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"[ERROR] GetFiltersByCategoryId exception: {ex.Message}");
                // Console.WriteLine($"[ERROR] Stack Trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                    Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }
        
        // POST: /api/productoptions - Create a new ProductOption
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProductOption([FromBody] ProductOptionDTOs.CreateProductOptionRequest req)
        {
            try
            {
                // Console.WriteLine($"[ProductOptions] CreateProductOption called");
                // Console.WriteLine($"[ProductOptions] Name: {req.Name}, CategoryId: {req.CategoryId}");

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

                // Console.WriteLine($"[ProductOptions] Created new option: {newOption.Name} (ID: {newOption.Id})");

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
                // Console.WriteLine($"[ProductOptions] Error in CreateProductOption: {ex.Message}");
                return StatusCode(500, new { message = "Error creating product option", error = ex.Message });
            }
        }

        // GET: /api/productoptions/{id} - Get a specific ProductOption with its values
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProductOption(int id)
        {
            try
            {
                // Console.WriteLine($"[ProductOptions] GetProductOption called with id: {id}");

                var option = await _db.ProductOptions
                    .FirstOrDefaultAsync(po => po.Id == id);

                if (option == null)
                {
                    // Console.WriteLine($"[ProductOptions] Option not found: {id}");
                    return NotFound(new { message = "Product option not found" });
                }

                // Console.WriteLine($"[ProductOptions] Found option: {option.Name}");

                // Query option values directly
                var optionValues = await _db.ProductOptionValues
                    .Where(ov => ov.ProductOptionId == id)
                    .Select(ov => new
                    {
                        ov.Id,
                        ov.Value
                    })
                    .ToListAsync();

                return Ok(new
                {
                    option.Id,
                    option.Name,
                    option.CategoryId,
                    OptionValues = optionValues
                });
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"[ProductOptions] Error in GetProductOption: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving product option", error = ex.Message });
            }
        }

        // POST: /api/productoptions/{optionId}/values - Add a new value to an existing ProductOption
        [HttpPost("{optionId:int}/values")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOptionValue(int optionId, [FromBody] ProductOptionDTOs.CreateOptionValueRequest req)
        {
            try
            {
                // Console.WriteLine($"[ProductOptions] CreateOptionValue called");
                // Console.WriteLine($"[ProductOptions] OptionId: {optionId}, Value: {req.Value}");

                if (string.IsNullOrWhiteSpace(req.Value))
                    return BadRequest(new { message = "Option value is required" });

                // Check if option exists
                var option = await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == optionId);
                if (option == null)
                {
                    // Console.WriteLine($"[ProductOptions] Option not found: {optionId}");
                    return NotFound(new { message = "Product option not found" });
                }

                // Console.WriteLine($"[ProductOptions] Found option: {option.Name}");

                // Check if value already exists for this option
                var existingValue = await _db.ProductOptionValues
                    .FirstOrDefaultAsync(pov => pov.ProductOptionId == optionId && pov.Value == req.Value);

                if (existingValue != null)
                {
                    // Console.WriteLine($"[ProductOptions] Value already exists: {req.Value}");
                    return BadRequest(new { message = $"Value '{req.Value}' already exists for this option" });
                }

                var newValue = new ProductOptionValue
                {
                    Value = req.Value,
                    ProductOptionId = optionId
                };

                _db.ProductOptionValues.Add(newValue);
                await _db.SaveChangesAsync();

                // Console.WriteLine($"[ProductOptions] Created new value: {newValue.Value} (ID: {newValue.Id}) for option {optionId}");

                return CreatedAtAction(nameof(GetProductOption), new { id = optionId }, new
                {
                    newValue.Id,
                    newValue.Value,
                    newValue.ProductOptionId
                });
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"[ProductOptions] Error in CreateOptionValue: {ex.Message}");
                // Console.WriteLine($"[ProductOptions] Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Error creating option value", error = ex.Message });
            }
        }
    }
}