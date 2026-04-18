"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationControlsProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  fromItem: number;
  toItem: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

function buildPageButtons(currentPage: number, totalPages: number): Array<number | "dots"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: Array<number | "dots"> = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) pages.push("dots");
  for (let page = left; page <= right; page += 1) pages.push(page);
  if (right < totalPages - 1) pages.push("dots");

  pages.push(totalPages);
  return pages;
}

export function PaginationControls({
  page,
  pageSize,
  totalItems,
  totalPages,
  fromItem,
  toItem,
  onPageChange,
  onPageSizeChange,
  className
}: PaginationControlsProps) {
  if (totalItems === 0) return null;

  const pageButtons = buildPageButtons(page, totalPages);
  const wrapperClass = className ? `mt-4 ${className}` : "mt-4";

  return (
    <div className={wrapperClass}>
      <div className="workspace-card-soft border-pro-primary/20 bg-gradient-to-r from-pro-primary/10 via-transparent to-pro-accent/10 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs text-pro-muted">
            <p>
              Showing <span className="text-pro-main font-semibold">{fromItem}</span>-<span className="text-pro-main font-semibold">{toItem}</span> of{" "}
              <span className="text-pro-main font-semibold">{totalItems}</span>
            </p>
            <label className="inline-flex items-center gap-2">
              <span>Per page</span>
              <select
                className="workspace-input h-8 w-[86px] px-2 text-xs"
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                value={pageSize}
              >
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              aria-label="First page"
              className="btn-pro-secondary grid size-8 place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => onPageChange(1)}
              type="button"
            >
              <ChevronsLeft size={14} />
            </button>
            <button
              aria-label="Previous page"
              className="btn-pro-secondary grid size-8 place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
              type="button"
            >
              <ChevronLeft size={14} />
            </button>

            {pageButtons.map((entry, index) =>
              entry === "dots" ? (
                <span className="inline-flex w-6 justify-center text-xs text-pro-muted" key={`dots-${index}`}>
                  ...
                </span>
              ) : (
                <button
                  className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs transition ${
                    entry === page
                      ? "bg-gradient-to-r from-pro-primary to-[#7C3AED] text-white shadow-pro-purple"
                      : "border border-pro-surface bg-white/[0.03] text-pro-muted hover:text-pro-main"
                  }`}
                  key={entry}
                  onClick={() => onPageChange(entry)}
                  type="button"
                >
                  {entry}
                </button>
              )
            )}

            <button
              aria-label="Next page"
              className="btn-pro-secondary grid size-8 place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
              type="button"
            >
              <ChevronRight size={14} />
            </button>
            <button
              aria-label="Last page"
              className="btn-pro-secondary grid size-8 place-items-center p-0 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => onPageChange(totalPages)}
              type="button"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
