import { useCallback } from "react";

interface UsePaginationOptions {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  scrollToTop?: boolean;
}

interface UsePaginationReturn {
  totalPages: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  goToPage: (page: number) => void;
  goNext: () => void;
  goPrev: () => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination({ totalCount, pageSize, currentPage, onPageChange, scrollToTop = true }: UsePaginationOptions): UsePaginationReturn {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      if (clamped === currentPage) return;
      onPageChange(clamped);
      if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentPage, totalPages, onPageChange, scrollToTop]
  );

  const goNext = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const goPrev = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return { totalPages, canGoNext, canGoPrev, goToPage, goNext, goPrev, startIndex, endIndex };
}