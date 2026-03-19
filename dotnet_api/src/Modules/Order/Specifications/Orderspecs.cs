using WebApp_API.DTOs;
using WebApp_API.Entities;

namespace WebApp_API.Specifications
{
    // DTO used for filtering and sorting orders in admin order listing
    public class OrderFilterParameters
    {
        public string? Status { get; set; }
        public string? MinDate { get; set; }
        public string? MaxDate { get; set; }
        public string SortBy { get; set; } = "orderDate";
        public string SortOrder { get; set; } = "desc";
    }
}