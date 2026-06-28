using MediatR;
using Microsoft.EntityFrameworkCore;
using WebApp_API.Data;
using WebApp_API.Modules.ProductOptions.DTOs;
using WebApp_API.Modules.ProductOptions.Repositories;

namespace WebApp_API.Modules.ProductOptions.Queries.GetProductOptionsByCategoryId
{
    public class GetProductOptionsByCategoryIdQueryHandler : IRequestHandler<GetProductOptionsByCategoryIdQuery, List<ProductOptionDTOs.ProductOptionGroupResponse>>
    {
        private readonly IProductOptionRepository _repo;
        private readonly AppDbContext _db;

        public GetProductOptionsByCategoryIdQueryHandler(IProductOptionRepository repo, AppDbContext db)
        {
            _repo = repo;
            _db = db;
        }

        public async Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> Handle(GetProductOptionsByCategoryIdQuery request, CancellationToken cancellationToken)
        {
            var options = await _repo.GetByCategoryIdAsync(request.CategoryId);
            return await MapToGroupListAsync(options);
        }

        private async Task<List<ProductOptionDTOs.ProductOptionGroupResponse>> MapToGroupListAsync(List<Entities.ProductOption> options)
        {
            var result = new List<ProductOptionDTOs.ProductOptionGroupResponse>(options.Count);

            foreach (var option in options)
            {
                var values = await _db.ProductOptionValues.Where(v => v.ProductOptionId == option.Id)
                                                          .OrderBy(v => v.Value)
                                                          .Select(v => new ProductOptionDTOs.OptionValueResponse
                                                          {
                                                              OptionValueId = v.Id,
                                                              Value = v.Value,
                                                          })
                                                          .ToListAsync();

                result.Add(new ProductOptionDTOs.ProductOptionGroupResponse
                {
                    OptionId = option.Id,
                    OptionName = option.Name,
                    OptionValues = values
                });
            }

            return result;
        }
    }
}
