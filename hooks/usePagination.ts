"use client";

import { useEffect, useMemo, useState } from "react";

type PaginationState<T> = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pageItems: T[];
  fromItem: number;
  toItem: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

const MIN_PAGE_SIZE = 5;

export function usePagination<T>(items: readonly T[], initialPageSize = MIN_PAGE_SIZE): PaginationState<T> {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(Math.max(MIN_PAGE_SIZE, initialPageSize));

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setPageState((current) => {
      if (current < 1) return 1;
      if (current > totalPages) return totalPages;
      return current;
    });
  }, [totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, page, pageSize]);

  const fromItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const toItem = Math.min(page * pageSize, totalItems);

  const setPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(1, nextPage), totalPages);
    setPageState(safePage);
  };

  const setPageSize = (nextPageSize: number) => {
    const safePageSize = Math.max(MIN_PAGE_SIZE, nextPageSize);
    setPageSizeState(safePageSize);
    setPageState(1);
  };

  return {
    page,
    pageSize,
    totalItems,
    totalPages,
    pageItems,
    fromItem,
    toItem,
    setPage,
    setPageSize
  };
}
