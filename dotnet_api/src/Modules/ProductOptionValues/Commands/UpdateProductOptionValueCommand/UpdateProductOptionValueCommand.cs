using MediatR;
using WebApp_API.Modules.ProductOptionValues.DTOs;

namespace WebApp_API.Modules.ProductOptionValues.Commands.UpdateProductOptionValue
{
    public class UpdateProductOptionValueCommand : IRequest<bool>
    {
        public int OptionValueId { get; set; }
        public UpdateOptionValueRequest Request { get; set; }

        public UpdateProductOptionValueCommand(int optionValueId, UpdateOptionValueRequest request)
        {
            OptionValueId = optionValueId;
            Request = request;
        }
    }
}
