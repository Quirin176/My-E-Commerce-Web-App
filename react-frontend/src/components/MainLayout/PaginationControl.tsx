import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  showGoTo?: boolean;
  showSummary?: boolean;
}

export default function PaginationControl({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  showGoTo = true,
  showSummary = true,
}: PaginationControlProps) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const middlePages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page > 1 && page < totalPages && Math.abs(page - currentPage) <= 2
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 bg-white rounded-lg shadow">

      {/* Summary */}
      {showSummary && (
        <p className="text-gray-600 text-sm">
          Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of{" "}
          <strong>{totalCount}</strong>
        </p>
      )}

      {/* Page Buttons */}
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* First page */}
        <PageButton page={1} currentPage={currentPage} onPageChange={onPageChange} />

        {currentPage > 4 && <Ellipsis />}

        {middlePages.map((page) => (
          <PageButton key={page} page={page} currentPage={currentPage} onPageChange={onPageChange} />
        ))}

        {currentPage < totalPages - 3 && <Ellipsis />}

        {/* Last page */}
        {totalPages > 1 && (
          <PageButton page={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Go to page */}
      {showGoTo && (
        <div className="flex items-center gap-2">
          <label className="text-gray-600 text-sm">Go to:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = parseInt((e.target as HTMLInputElement).value);
                if (!isNaN(value)) onPageChange(value);
              }
            }}
            className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      )}
    </div>
  );
}

function PageButton({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <button
      onClick={() => onPageChange(page)}
      className={`px-3 py-2 rounded-lg font-semibold transition ${currentPage === page
        ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"}`}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return <span className="px-2 py-2 text-gray-400">...</span>;
}
