using MediatR;

namespace WebApp_API.Modules.ProductOptionValues.Commands.DeleteProductOptionValue
{
    public class DeleteProductOptionValueCommand : IRequest<bool>
    {
        public int OptionValueId { get; set; }

        public DeleteProductOptionValueCommand(int optionValueId) => OptionValueId = optionValueId;
    }
}
