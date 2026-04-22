using WebApp_API.DTOs;

namespace WebApp_API.Specifications
{
    public class UserFiltersSpec
    {
        public string? Role { get; init; }
        public string SortBy { get; init; } = "Id";
        public string SortOrder { get; init; } = "asc";
        public int Page { get; init; } = 1;
        public int PageSize { get; init; } = 10;
        public string? Search { get; init; }

        public static UserFiltersSpec From(UserDTOs.UsersFiltersParams param) => new()
        {
            Role = param.Role,
            SortBy = param.SortBy,
            SortOrder = param.SortOrder,
            Page = param.Page,
            PageSize = param.PageSize,
            Search = param.Search
        };
    }
}