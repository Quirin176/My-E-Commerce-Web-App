// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using WebApp_API.Data;
// using WebApp_API.DTOs;
// using WebApp_API.Entities;

// namespace WebApp_API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class ProductOptionsController : ControllerBase  // API Endpoint: /api/productoptions
//     {
//         private readonly AppDbContext _db;

//         public ProductOptionsController(AppDbContext db) => _db = db;

//         // GET: api/productoptions/category/slug/{categorySlug} - Get all options and all their optionvalues for a category by slug
//         [HttpGet("category/slug/{categorySlug}")]
//         public async Task<IActionResult> GetFiltersByCategorySlug(string categorySlug)
//         {
//             try
//             {
//                 if (string.IsNullOrWhiteSpace(categorySlug))
//                     return BadRequest(new { message = "Category slug is required" });

//                 var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);

//                 if (category == null)
//                 {
//                     return Ok(new List<object>());
//                 }

//                 var productOptions = await _db.ProductOptions
//                     .Where(o => o.CategoryId == category.Id)
//                     .ToListAsync();

//                 var result = new List<object>();

//                 foreach (var option in productOptions)
//                 {
//                     var optionValues = await _db.ProductOptionValues
//                         .Where(ov => ov.ProductOptionId == option.Id)
//                         .OrderBy(ov => ov.Value)
//                         .Select(ov => new
//                         {
//                             optionValueId = ov.Id,
//                             value = ov.Value
//                         })
//                         .ToListAsync();

//                     result.Add(new
//                     {
//                         optionId = option.Id,
//                         optionName = option.Name,
//                         optionValues = optionValues
//                     });
//                 }

//                 return Ok(result);
//             }
//             catch (Exception ex)
//             {
//                 if (ex.InnerException != null)
//                     Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

//                 return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
//             }
//         }

//         // GET: api/productoptions/category/id/{categoryId} - Get all options and all their optionvalues for a category by ID
//         [HttpGet("category/id/{categoryId}")]
//         public async Task<IActionResult> GetFiltersByCategoryId(int categoryId)
//         {
//             try
//             {
//                 if (categoryId <= 0)
//                     return BadRequest(new { message = "Valid category ID is required" });

//                 var category = await _db.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
//                 // Console.WriteLine($"[Filters] Category found: {(category != null ? category.Name : "NULL")}");

//                 if (category == null)
//                     return Ok(new List<object>());

//                 var productOptions = await _db.ProductOptions
//                     .Where(o => o.CategoryId == categoryId)
//                     .ToListAsync();

//                 // Console.WriteLine($"[Filters] Found {productOptions.Count} ProductOptions");

//                 var result = new List<object>();

//                 foreach (var option in productOptions)
//                 {
//                     var optionValues = await _db.ProductOptionValues
//                         .Where(ov => ov.ProductOptionId == option.Id)
//                         .OrderBy(ov => ov.Value)
//                         .Select(ov => new
//                         {
//                             optionValueId = ov.Id,
//                             value = ov.Value
//                         })
//                         .ToListAsync();

//                     result.Add(new
//                     {
//                         optionId = option.Id,
//                         optionName = option.Name,
//                         optionValues = optionValues
//                     });
//                 }

//                 return Ok(result);
//             }
//             catch (Exception ex)
//             {
//                 if (ex.InnerException != null)
//                     Console.WriteLine($"[ERROR] Inner Exception: {ex.InnerException.Message}");

//                 return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
//             }
//         }
        
//         // GET: /api/productoptions/{id} - Get a specific ProductOption with its values
//         [HttpGet("{id:int}")]
//         public async Task<IActionResult> GetProductOption(int id)
//         {
//             try
//             {
//                 var option = await _db.ProductOptions
//                     .FirstOrDefaultAsync(po => po.Id == id);

//                 if (option == null)
//                 {
//                     return NotFound(new { message = "Product option not found" });
//                 }

//                 // Query option values directly
//                 var optionValues = await _db.ProductOptionValues
//                     .Where(ov => ov.ProductOptionId == id)
//                     .Select(ov => new
//                     {
//                         ov.Id,
//                         ov.Value
//                     })
//                     .ToListAsync();

//                 return Ok(new
//                 {
//                     option.Id,
//                     option.Name,
//                     option.CategoryId,
//                     OptionValues = optionValues
//                 });
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { message = "Error retrieving product option", error = ex.Message });
//             }
//         }

//         // POST: /api/productoptions - Create a new ProductOption
//         [HttpPost]
//         [Authorize(Roles = "Admin")]
//         public async Task<IActionResult> CreateProductOption([FromBody] ProductOptionDTOs.CreateProductOptionRequest req)
//         {
//             try
//             {
//                 if (string.IsNullOrWhiteSpace(req.Name))
//                     return BadRequest(new { message = "Option name is required" });

//                 if (!req.CategoryId.HasValue || req.CategoryId <= 0)
//                     return BadRequest(new { message = "Category ID is required" });

//                 // Check if category exists
//                 var categoryExists = await _db.Categories.AnyAsync(c => c.Id == req.CategoryId.Value);
//                 if (!categoryExists)
//                     return BadRequest(new { message = "Category does not exist" });

//                 // Check if option with same name already exists for this category
//                 var existingOption = await _db.ProductOptions
//                     .FirstOrDefaultAsync(po => po.CategoryId == req.CategoryId.Value && po.Name == req.Name);

//                 if (existingOption != null)
//                     return BadRequest(new { message = $"Option '{req.Name}' already exists for this category" });

//                 var newOption = new ProductOption
//                 {
//                     Name = req.Name,
//                     CategoryId = req.CategoryId.Value
//                 };

//                 _db.ProductOptions.Add(newOption);
//                 await _db.SaveChangesAsync();

//                 return CreatedAtAction(nameof(GetProductOption), new { id = newOption.Id }, new
//                 {
//                     newOption.Id,
//                     newOption.Name,
//                     newOption.CategoryId,
//                     OptionValues = new List<object>()
//                 });
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { message = "Error creating product option", error = ex.Message });
//             }
//         }

//         // DELETE: /api/productoptions/{optionId} - Delete a ProductOption and its values
//         [HttpDelete("{optionId:int}")]
//         [Authorize(Roles = "Admin")]
//         public async Task<IActionResult> DeleteProductOption(int optionId)
//         {
//             try
//             {
//                 var option = await _db.ProductOptions.FirstOrDefaultAsync(po => po.Id == optionId);
//                 if (option == null)
//                     return NotFound(new { message = "Product option not found" });

//                 // Remove associated option values first
//                 // var optionValues = await _db.ProductOptionValues.Where(pov => pov.ProductOptionId == optionId).ToListAsync();
//                 // _db.ProductOptionValues.RemoveRange(optionValues);

//                 // Remove the product option
//                 _db.ProductOptions.Remove(option);
//                 await _db.SaveChangesAsync();

//                 return Ok(new { message = "Product option and its values deleted successfully" });
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, new { message = "Error deleting product option", error = ex.Message });
//             }
//         }
//     }
// }
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp_API.DTOs;
using WebApp_API.Services;

namespace WebApp_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductOptionsController : ControllerBase  // API Endpoint: /api/productoptions
    {
        private readonly IProductOptionService _service;

        public ProductOptionsController(IProductOptionService service) => _service = service;

        // GET: /api/productoptions/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var option = await _service.GetByIdAsync(id);
            return option is null ? NotFound(new { message = "Product option not found" }) : Ok(option);
        }

        // GET: /api/productoptions/category/id/{categoryId}
        [HttpGet("category/id/{categoryId:int}")]
        public async Task<IActionResult> GetByCategoryId(int categoryId)
        {
            if (categoryId <= 0)
                return BadRequest(new { message = "Valid category ID is required" });

            try
            {
                var options = await _service.GetByCategoryIdAsync(categoryId);
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // GET: /api/productoptions/category/slug/{categorySlug}
        [HttpGet("category/slug/{categorySlug}")]
        public async Task<IActionResult> GetByCategorySlug(string categorySlug)
        {
            if (string.IsNullOrWhiteSpace(categorySlug))
                return BadRequest(new { message = "Category slug is required" });

            try
            {
                var options = await _service.GetByCategorySlugAsync(categorySlug);
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading filters", error = ex.Message });
            }
        }

        // POST: /api/productoptions
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductOptionDTOs.CreateProductOptionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Option name is required" });

            if (!request.CategoryId.HasValue || request.CategoryId <= 0)
                return BadRequest(new { message = "Category ID is required" });

            try
            {
                var created = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product option", error = ex.Message });
            }
        }

        // DELETE: /api/productoptions/{id}
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _service.DeleteAsync(id);
                return deleted
                    ? Ok(new { message = "Product option deleted successfully" })
                    : NotFound(new { message = "Product option not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting product option", error = ex.Message });
            }
        }
    }
}