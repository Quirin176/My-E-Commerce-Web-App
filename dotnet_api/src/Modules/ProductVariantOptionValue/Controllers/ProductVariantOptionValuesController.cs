// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using WebApp_API.Entities;
// using WebApp_API.Services;

// namespace WebApp_API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class ProductVariantOptionValueController : ControllerBase
//     {
//         private readonly IProductVariantOptionValueService _service;

//         public ProductVariantOptionValueController(IProductVariantOptionValueService service)
//         {
//             _service = service;
//         }

//         [HttpGet]
//         public async Task<IActionResult> GetAll()
//             => Ok(await _service.GetAllAsync());

//         [HttpGet("variant/{variantId:int}")]
//         public async Task<IActionResult> GetByVariant(int variantId)
//             => Ok(await _service.GetByVariantIdAsync(variantId));

//         [HttpGet("{variantId:int}/{optionValueId:int}")]
//         public async Task<IActionResult> Get(int variantId, int optionValueId)
//         {
//             var item = await _service.GetAsync(variantId, optionValueId);
//             return item == null ? NotFound() : Ok(item);
//         }

//         [HttpPost]
//         public async Task<IActionResult> Create(ProductVariantOptionValue model)
//         {
//             var created = await _service.CreateAsync(model);
//             return CreatedAtAction(nameof(Get),
//                 new { variantId = created.ProductVariantId, optionValueId = created.ProductOptionValueId },
//                 created);
//         }

//         [HttpDelete("{variantId:int}/{optionValueId:int}")]
//         public async Task<IActionResult> Delete(int variantId, int optionValueId)
//         {
//             var deleted = await _service.DeleteAsync(variantId, optionValueId);
//             return deleted ? Ok() : NotFound();
//         }
//     }
// }