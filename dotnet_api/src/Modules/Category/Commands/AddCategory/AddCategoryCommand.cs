using MediatR;
using WebApp_API.DTOs;

namespace WebApp_API.Features.Categories.Commands.AddCategory
{
    public record AddCategoryCommand(CategoryDTOs.CreateCategoryRequest Category) : IRequest;
}