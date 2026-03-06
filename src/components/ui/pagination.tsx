"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useURLQuery } from "@/hooks/useUrlQuery";
import { cn } from "@/lib/utils";

type PageItem = number | "ellipsis-left" | "ellipsis-right";

interface TablePaginationProps {
  totalEntries: number;
  pageSize: number;
  maxVisiblePages?: number;
  className?: string;
}

function getVisiblePageItems(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
): PageItem[] {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= maxVisiblePages) {
    return [...Array.from({ length: maxVisiblePages }, (_, index) => index + 1), "ellipsis-right"];
  }

  if (currentPage > totalPages - maxVisiblePages) {
    return [
      "ellipsis-left",
      ...Array.from(
        { length: maxVisiblePages },
        (_, index) => totalPages - maxVisiblePages + index + 1,
      ),
    ];
  }

  return ["ellipsis-left", currentPage - 1, currentPage, currentPage + 1, "ellipsis-right"];
}

function TablePagination({
  totalEntries,
  pageSize,
  maxVisiblePages = 3,
  className,
}: TablePaginationProps) {
  const { value, setURLQuery } = useURLQuery<{ page?: string }>();
  const totalPages = Math.max(1, Math.ceil(totalEntries / Math.max(1, pageSize)));
  const parsedPage = Number(value.page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.min(Math.floor(parsedPage), totalPages)
      : 1;
  const fromEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toEntry = totalEntries === 0 ? 0 : Math.min(currentPage * pageSize, totalEntries);

  const setPage = (page: number) => {
    const nextPage = Math.min(totalPages, Math.max(1, page));
    setURLQuery({
      page: String(nextPage),
    });
  };

  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);
  const pageItems = getVisiblePageItems(currentPage, totalPages, Math.max(3, maxVisiblePages));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <p className="text-base font-semibold text-text-black">
        Showing {fromEntry}-{toEntry} of {totalEntries} entries
      </p>

      <nav
        className="inline-flex items-center gap-1 self-start rounded-full bg-primary-grey-undertone p-1 md:self-auto"
        aria-label="Table pagination"
      >
        <button
          type="button"
          onClick={() => setPage(previousPage)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-base font-medium text-text-grey transition-colors hover:text-text-black disabled:pointer-events-none disabled:text-alert-disabled"
        >
          Previous page
        </button>

        <button
          type="button"
          onClick={() => setPage(previousPage)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary-black transition-colors hover:bg-primary-white hover:text-text-black disabled:pointer-events-none disabled:text-alert-disabled"
        >
          <ChevronLeft className="size-5" />
        </button>

        {pageItems.map((pageItem, index) =>
          pageItem === "ellipsis-left" || pageItem === "ellipsis-right" ? (
            <span
              key={`${pageItem}-${index}`}
              className="px-2 text-base text-text-grey"
              aria-hidden
            >
              ...
            </span>
          ) : (
            <button
              key={pageItem}
              type="button"
              onClick={() => setPage(pageItem)}
              className={cn(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-base font-medium transition-colors",
                currentPage === pageItem
                  ? "bg-primary-white text-text-black"
                  : "text-text-grey hover:bg-primary-white hover:text-text-black",
              )}
              aria-current={currentPage === pageItem ? "page" : undefined}
            >
              {pageItem}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => setPage(nextPage)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-primary-black transition-colors hover:bg-primary-white hover:text-text-black disabled:pointer-events-none disabled:text-alert-disabled"
        >
          <ChevronRight className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => setPage(nextPage)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-base font-semibold text-text-black transition-colors hover:text-primary-black disabled:pointer-events-none disabled:text-alert-disabled"
        >
          Next page
        </button>
      </nav>
    </div>
  );
}

export { TablePagination };
