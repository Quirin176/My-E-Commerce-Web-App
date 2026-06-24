interface AdminOrderFiltersProps {
    minDate: string;
    maxDate: string;
    sortBy: string;
    sortOrder: string;
    setMinDate: (value: string) => void;
    setMaxDate: (value: string) => void;
    setSortBy: (value: string) => void;
    setSortOrder: (value: string) => void;
    clearFilters: () => void;
}

export default function AdminOrderFilters({
    minDate,
    maxDate,
    sortBy,
    sortOrder,
    setMinDate,
    setMaxDate,
    setSortBy,
    setSortOrder,
    clearFilters,
}: AdminOrderFiltersProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                        <label className="font-bold whitespace-nowrap">Start Date</label>
                        <input
                            type="date"
                            value={minDate}
                            onChange={(e) => setMinDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="font-bold whitespace-nowrap">End Date</label>
                        <input
                            type="date"
                            value={maxDate}
                            onChange={(e) => setMaxDate(e.target.value)}
                            className="border-2 rounded-xl px-2 py-1 cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border-2 rounded-xl px-2 py-1 cursor-pointer"
                    >
                        <option value="" className="bg-(--bg-surface)">Sort By</option>
                        <option value="customerName" className="bg-(--bg-surface)">Customer Name</option>
                        <option value="totalAmount" className="bg-(--bg-surface)">Total Amount</option>
                        <option value="orderDate" className="bg-(--bg-surface)">Order Date</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border-2 rounded-xl px-2 py-1 cursor-pointer"
                    >
                        <option value="" className="bg-(--bg-surface)">Order</option>
                        <option value="asc" className="bg-(--bg-surface)">Ascending</option>
                        <option value="desc" className="bg-(--bg-surface)">Descending</option>
                    </select>
                </div>
            </div>

            <button
                onClick={clearFilters}
                className="text-end text-red-500 font-semibold hover:underline transition text-sm cursor-pointer"
            >
                Clear Filters
            </button>
        </div>
    );
}