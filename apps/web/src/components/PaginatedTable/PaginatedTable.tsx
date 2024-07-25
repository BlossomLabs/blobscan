import { useCallback } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
import Skeleton from "react-loading-skeleton";

import { Card } from "~/components/Cards/Card";
import { Dropdown } from "~/components/Dropdown";
import type { DropdownProps } from "~/components/Dropdown";
import { Header } from "~/components/Header";
import type { PaginationProps } from "~/components/Pagination";
import { Pagination } from "~/components/Pagination";
import type { TableProps } from "~/components/Table";
import { Table } from "~/components/Table";

const DEFAULT_TABLE_EMPTY_STATE = "No items";
const PAGE_SIZES = [10, 25, 50, 100];

type PaginationData = {
  page: number;
  pageSize: number;
};

export type PaginatedTableProps = {
  isLoading: boolean;
  title: string;
  totalItems: number;
  isExpandable?: boolean;
  paginationData: PaginationData;
} & Pick<TableProps, "headers" | "rows">;

// TODO: Improve skeleton UI
export const PaginatedTable: FC<PaginatedTableProps> = function ({
  title,
  isLoading,
  headers,
  rows,
  totalItems,
  paginationData,
  isExpandable = false,
}) {
  const { page, pageSize } = paginationData;

  const router = useRouter();
  const pages =
    totalItems !== undefined
      ? totalItems === 0
        ? 1
        : Math.ceil(totalItems / 10)
      : undefined;
  const hasItems = totalItems > 0;

  const handlePageSizeSelection = useCallback<DropdownProps["onChange"]>(
    (newPageSize: number) =>
      void router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          /**
           * Update the selected page to a lower value if we require less pages to show the
           * new amount of elements per page.
           */
          p: Math.min(Math.ceil(totalItems ?? 0 / newPageSize), page),
          ps: newPageSize,
        },
      }),
    [page, totalItems, router]
  );

  const handlePageSelection = useCallback<PaginationProps["onChange"]>(
    (newPage) =>
      void router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          p: newPage,
          ps: pageSize,
        },
      }),
    [pageSize, router]
  );

  return (
    <>
      <Header>{title}</Header>
      {isLoading ? (
        <Skeleton height={400} width={"100%"} />
      ) : (
        <Card
          header={
            hasItems ? (
              <div className={`flex flex-col justify-end md:flex-row`}>
                <div className="w-full self-center sm:w-auto">
                  <Pagination
                    selected={page}
                    pages={pages}
                    onChange={handlePageSelection}
                  />
                </div>
              </div>
            ) : undefined
          }
          emptyState={DEFAULT_TABLE_EMPTY_STATE}
        >
          {hasItems ? (
            <div className="flex flex-col gap-6">
              <Table
                expandableRowsMode={isExpandable}
                headers={headers}
                rows={rows}
              />
              <div className="flex w-full flex-col items-center gap-3 text-sm md:flex-row md:justify-between">
                <div className="flex items-center justify-start gap-2">
                  Displayed items:
                  <Dropdown
                    items={PAGE_SIZES}
                    selected={pageSize}
                    width="w-full"
                    onChange={handlePageSizeSelection}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <Pagination
                    selected={page}
                    pages={pages}
                    inverseCompact
                    onChange={handlePageSelection}
                  />
                </div>
              </div>
            </div>
          ) : undefined}
        </Card>
      )}
    </>
  );
};
