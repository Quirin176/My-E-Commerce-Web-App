using MediatR;
using WebApp_API.Modules.Categories.DTOs;

namespace WebApp_API.Modules.Categories.Commands.AddCategory
{
    public record AddCategoryCommand(CreateCategoryRequest Category) : IRequest;
}