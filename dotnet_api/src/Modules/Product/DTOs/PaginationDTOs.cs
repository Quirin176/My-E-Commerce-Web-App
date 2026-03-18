namespace WebApp_API.DTOs
{
    public class PaginationDTOs
    {
        public class PaginationParams
        {
            private const int MaxPageSize = 100;
            private int _pageSize = 10;

            public int Page { get; set; } = 1;

            public int PageSize
            {
                get => _pageSize;
                set => _pageSize = value < 1 ? 10 : value > MaxPageSize ? MaxPageSize : value;
            }
        }

        public class PaginatedResponse<T>
        {
            public bool Success { get; set; } = true;
            public IEnumerable<T> Data { get; set; } = Enumerable.Empty<T>();
            public PaginationMeta Pagination { get; set; } = new();
        }

        public class PaginationMeta
        {
            public int CurrentPage { get; set; }
            public int PageSize { get; set; }
            public int TotalCount { get; set; }
            public int TotalPages { get; set; }
            public bool HasNextPage { get; set; }
            public bool HasPreviousPage { get; set; }

            public static PaginationMeta From(int page, int pageSize, int totalCount)
            {
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
                return new PaginationMeta
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    HasNextPage = page < totalPages,
                    HasPreviousPage = page > 1
                };
            }
        }
    }
}