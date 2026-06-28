using MediatR;
using WebApp_API.Modules.ProductImages.DTOs;

namespace WebApp_API.Modules.ProductImages.Commands.AddProductImages
{
    public class AddProductImagesCommand : IRequest<Unit>
    {
        public List<AddProductImageRequest> Requests { get; set; }

        public AddProductImagesCommand(List<AddProductImageRequest> requests) => Requests = requests;
    }
}
