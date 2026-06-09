using WebApp_API.Enums;

namespace WebApp_API.Specifications
{
    // DTO used for filtering and sorting orders in admin order listing
    public class OrderFiltersParameters
    {
        public OrderStatus? Status { get; set; }
        public string? MinDate { get; set; }
        public string? MaxDate { get; set; }
        public string SortBy { get; set; } = "orderDate";
        public string SortOrder { get; set; } = "desc";
    }
}