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
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProductsController(AppDbContext db) => _db = db;

        // GET: /api/products - Get all products with optional filters
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string category = null,
            [FromQuery] decimal minPrice = 0,
            [FromQuery] decimal maxPrice = decimal.MaxValue,
            [FromQuery] string options = null,
            [FromQuery] string priceOrder = "newest")
        {
            IQueryable<Product> query = _db.Products.Include(p => p.Category);

            if (!string.IsNullOrWhiteSpace(category))
            {
                var categoryEntity = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == category);
                if (categoryEntity == null)
                    return Ok(new List<Product>());
                query = query.Where(p => p.CategoryId == categoryEntity.Id);
            }

            if (minPrice > 0)
                query = query.Where(p => p.Price >= minPrice);

            if (maxPrice < decimal.MaxValue)
                query = query.Where(p => p.Price <= maxPrice);

            if (!string.IsNullOrWhiteSpace(options))
            {
                var selectedOptionIds = options.Split(',')
                    .Select(s => int.TryParse(s.Trim(), out var id) ? (int?)id : null)
                    .Where(id => id.HasValue)
                    .Select(id => id.Value)
                    .ToList();

                if (selectedOptionIds.Count > 0)
                {
                    var productIds = await _db.ProductFilters
                        .Where(pf => selectedOptionIds.Contains(pf.OptionValueId))
                        .Select(pf => pf.ProductId)
                        .Distinct()
                        .ToListAsync();

                    query = query.Where(p => productIds.Contains(p.Id));
                }
            }

            query = priceOrder switch
            {
                "ascending" => query.OrderBy(p => p.Price),
                "descending" => query.OrderByDescending(p => p.Price),
                _ => query.OrderByDescending(p => p.Id)
            };

            var products = await query.Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.ImageUrl,
                p.ShortDescription,
                p.CategoryId,
                p.Slug,
                Options = _db.ProductFilters
                        .Where(f => f.ProductId == p.Id)
                        .Select(f => new
                        {
                            optionName = f.OptionValue.ProductOption.Name,
                            value = f.OptionValue.Value
                        }).ToList()
            })
                .ToListAsync();

            return Ok(products);
        }

        // GET: /api/products/{id} - Get product by ID with all images
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            // Get all images for this product
            var images = await _db.ProductImages
                .Where(pi => pi.ProductId == id)
                .OrderBy(pi => pi.DisplayOrder)
                .Select(pi => pi.ImageUrl)
                .ToListAsync();

            // Get all product options (attributes) for this product
            var options = await _db.ProductFilters
                .Where(pf => pf.ProductId == id)
                .Select(pf => new
                {
                    optionName = pf.OptionValue.ProductOption.Name,
                    value = pf.OptionValue.Value
                })
                .ToListAsync();

            // Return product with images and options
            var response = new
            {
                product.Id,
                product.Name,
                product.Price,
                product.ImageUrl,
                product.ShortDescription,
                product.Description,
                product.Slug,
                product.CategoryId,
                Category = new
                {
                    product.Category.Id,
                    product.Category.Name,
                    product.Category.Slug
                },
                Images = images,
                Options = options
            };

            return Ok(response);
        }

        // GET: /api/products/{slug} - Get product by Slug with all images
        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var product = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Slug == slug);

            if (product == null)
                return NotFound();

            // Get all images for this product
            var images = await _db.ProductImages
                .Where(pi => pi.ProductId == product.Id)
                .OrderBy(pi => pi.DisplayOrder)
                .Select(pi => pi.ImageUrl)
                .ToListAsync();

            // Get all product options (attributes) for this product
            var options = await _db.ProductFilters
                .Where(pf => pf.ProductId == product.Id)
                .Select(pf => new
                {
                    optionName = pf.OptionValue.ProductOption.Name,
                    value = pf.OptionValue.Value
                })
                .ToListAsync();

            // Return product with images and options
            var response = new
            {
                product.Id,
                product.Name,
                product.Price,
                product.ImageUrl,
                product.ShortDescription,
                product.Description,
                product.Slug,
                product.CategoryId,
                Category = new
                {
                    product.Category.Id,
                    product.Category.Name,
                    product.Category.Slug
                },
                Images = images,
                Options = options
            };

            return Ok(response);
        }

        // GET: /api/products/categories/{categorySlug}/brands
        [HttpGet("categories/{categorySlug}/brands")]
        public async Task<IActionResult> GetBrandsByCategory(string categorySlug)
        {
            var category = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
            if (category == null)
                return NotFound(new { message = "Category not found" });

            var brands = await _db.ProductOptionValues
                .Where(pov => _db.ProductOptions
                    .Where(po => po.CategoryId == category.Id && po.Name == "Brand")
                    .Select(po => po.Id)
                    .Contains(pov.ProductOptionId))
                .Select(pov => pov.Value)
                .Distinct()
                .ToListAsync();

            return Ok(brands);
        }

        // GET: /api/products/filter - Filter products by category, price, brand, and dynamic options
        [HttpGet("filter")]
        public async Task<IActionResult> FilterProducts(
            [FromQuery] string category,
            [FromQuery] decimal minPrice = 0,
            [FromQuery] decimal maxPrice = decimal.MaxValue,
            [FromQuery] string options = null,
            [FromQuery] string priceOrder = "newest")
        {
            if (string.IsNullOrWhiteSpace(category))
                return BadRequest(new { message = "Category is required" });

            var categoryEntity = await _db.Categories.FirstOrDefaultAsync(c => c.Slug == category);
            if (categoryEntity == null)
                return Ok(new List<Product>());

            IQueryable<Product> query = _db.Products
                .Where(p => p.CategoryId == categoryEntity.Id)
                .Include(p => p.Category);

            if (minPrice > 0)
                query = query.Where(p => p.Price >= minPrice);

            if (maxPrice < decimal.MaxValue)
                query = query.Where(p => p.Price <= maxPrice);

            // Filter by selected option values
            if (!string.IsNullOrWhiteSpace(options))
            {
                var selectedOptionIds = options.Split(',')
                    .Select(s => int.TryParse(s.Trim(), out var id) ? (int?)id : null)
                    .Where(id => id.HasValue)
                    .Select(id => id.Value)
                    .ToList();

                if (selectedOptionIds.Count > 0)
                {
                    // OR filtering: match ANY selected option value
                    var productIds = await _db.ProductFilters
                        .Where(pf => selectedOptionIds.Contains(pf.OptionValueId))
                        .Select(pf => pf.ProductId)
                        .Distinct()
                        .ToListAsync();

                    query = query.Where(p => productIds.Contains(p.Id));
                }
            }

            // Apply sorting
            query = priceOrder switch
            {
                "ascending" => query.OrderBy(p => p.Price),
                "descending" => query.OrderByDescending(p => p.Price),
                _ => query.OrderByDescending(p => p.Id) // newest (default)
            };

            var products = await query.Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.ImageUrl,
                p.ShortDescription,
                Options = _db.ProductFilters
                        .Where(f => f.ProductId == p.Id)
                        .Select(f => new
                        {
                            optionName = f.OptionValue.ProductOption.Name,
                            value = f.OptionValue.Value
                        }).ToList()
            })
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ProductDTOs.CreateProductRequest request)
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(request.Name))
                return BadRequest(new { message = "Product Name is required" });

            if (string.IsNullOrWhiteSpace(request.Slug))
                return BadRequest(new { message = "Product Slug is required" });

            if (request.Price <= 0)
                return BadRequest(new { message = "Price must be greater than 0" });

            if (!request.CategoryId.HasValue || request.CategoryId <= 0)
                return BadRequest(new { message = "Category is required" });

            // Check if slug exists
            var existingProduct = await _db.Products.FirstOrDefaultAsync(p => p.Slug == request.Slug);
            if (existingProduct != null)
                return BadRequest(new { message = $"A product with slug '{request.Slug}' already exists" });

            // Check if category exists
            var categoryExists = await _db.Categories.AnyAsync(c => c.Id == request.CategoryId.Value);
            if (!categoryExists)
                return BadRequest(new { message = $"Category with ID {request.CategoryId} does not exist" });

            // Check if selected option values exist and belong to this category
            if (request.SelectedOptionValueIds != null && request.SelectedOptionValueIds.Count > 0)
            {
                var categoryId = request.CategoryId.Value;
                var validOptionIds = await _db.ProductOptionValues
                    .Where(pov => _db.ProductOptions
                        .Where(po => po.CategoryId == categoryId)
                        .Select(po => po.Id)
                        .Contains(pov.ProductOptionId))
                    .Select(pov => pov.Id)
                    .ToListAsync();

                foreach (var selectedId in request.SelectedOptionValueIds)
                {
                    if (!validOptionIds.Contains(selectedId))
                        return BadRequest(new { message = $"Option value ID {selectedId} is not valid for this category" });
                }
            }

            try
            {
                // Create product
                var product = new Product
                {
                    Name = request.Name,
                    Slug = request.Slug,
                    ShortDescription = request.ShortDescription,
                    Description = request.Description,
                    Price = request.Price,
                    ImageUrl = request.ImageUrl,
                    CategoryId = request.CategoryId.Value
                };

                _db.Products.Add(product);
                await _db.SaveChangesAsync();

                // Add product images
                var imageUrls = new List<string>();

                // Add ImageUrl (legacy - first image) if provided
                if (!string.IsNullOrWhiteSpace(request.ImageUrl))
                    imageUrls.Add(request.ImageUrl);

                // Add new ImageUrls list
                if (request.ImageUrls != null && request.ImageUrls.Count > 0)
                    imageUrls.AddRange(request.ImageUrls.Where(url => !string.IsNullOrWhiteSpace(url)));

                // Create ProductImage records
                int displayOrder = 0;
                foreach (var imageUrl in imageUrls.Distinct())
                {
                    var productImage = new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = imageUrl,
                        DisplayOrder = displayOrder++
                    };
                    _db.ProductImages.Add(productImage);
                }
                await _db.SaveChangesAsync();

                // Link to selected option values
                if (request.SelectedOptionValueIds != null && request.SelectedOptionValueIds.Count > 0)
                {
                    foreach (var optionValueId in request.SelectedOptionValueIds)
                    {
                        var filter = new ProductFilter
                        {
                            ProductId = product.Id,
                            OptionValueId = optionValueId
                        };
                        _db.ProductFilters.Add(filter);
                    }
                    await _db.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating product", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductDTOs.UpdateProductRequest request)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            if (!string.IsNullOrWhiteSpace(request.Name))
                product.Name = request.Name;

            if (!string.IsNullOrWhiteSpace(request.Slug))
                product.Slug = request.Slug;

            if (!string.IsNullOrWhiteSpace(request.ShortDescription))
                product.ShortDescription = request.ShortDescription;

            if (!string.IsNullOrWhiteSpace(request.Description))
                product.Description = request.Description;

            if (request.Price.HasValue && request.Price > 0)
                product.Price = request.Price.Value;

            if (!string.IsNullOrWhiteSpace(request.ImageUrl))
                product.ImageUrl = request.ImageUrl;

            if (request.CategoryId.HasValue)
                product.CategoryId = request.CategoryId.Value;

            _db.Products.Update(product);
            await _db.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // Get all options for a category with their values
        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetOptionsByCategory(int categoryId)
        {
            try
            {
                var options = await _db.ProductOptions
                    .Where(o => o.CategoryId == categoryId)
                    .Select(o => new
                    {
                        optionId = o.Id,
                        name = o.Name,
                        categoryId = o.CategoryId,
                        optionValues = _db.ProductOptionValues
                            .Where(ov => ov.ProductOptionId == o.Id)
                            .OrderBy(ov => ov.Value)
                            .Select(ov => new
                            {
                                optionValueId = ov.Id,
                                value = ov.Value
                            })
                            .ToList()
                    })
                    .ToListAsync();

                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error loading options", error = ex.Message });
            }
        }
    }
}
