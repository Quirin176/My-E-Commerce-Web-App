using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Modules.ProductOptions.DTOs;
using WebApp_API.Modules.ProductOptions.Repositories;

namespace WebApp_API.Modules.ProductOptions.Queries.GetProductOptionById
{
    public class GetProductOptionByIdQueryHandler : IRequestHandler<GetProductOptionByIdQuery, ProductOptionDTOs.ProductOptionResponse?>
    {
        private readonly IProductOptionRepository _repo;
        private readonly AppDbContext _db;

        public GetProductOptionByIdQueryHandler(IProductOptionRepository repo, AppDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        public async Task<ProductOptionDTOs.ProductOptionResponse?> Handle(GetProductOptionByIdQuery request, CancellationToken cancellationToken)
        {
            var option = await _repo.GetByIdAsync(request.Id);
            if (option is null) return null;

            return await MapToResponseAsync(option);
        }

        private async Task<ProductOptionDTOs.ProductOptionResponse> MapToResponseAsync(Entities.ProductOption option)
        {
            var values = await _db.ProductOptionValues.Where(v => v.ProductOptionId == option.Id)
                                                      .OrderBy(v => v.Value)
                                                      .Select(v => new ProductOptionDTOs.OptionValueResponse
                                                      {
                                                          OptionValueId = v.Id,
                                                          Value = v.Value,
                                                      })
                                                      .ToListAsync();

            return new ProductOptionDTOs.ProductOptionResponse
            {
                Id = option.Id,
                Name = option.Name,
                CategoryId = option.CategoryId,
                OptionValues = values
            };
        }
    }
}
