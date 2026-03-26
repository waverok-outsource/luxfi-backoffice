"use client";

import * as React from "react";

export function useFilteredTableRows<TData extends Record<string, unknown>>(
  rows: TData[],
  search: string,
  fields: Array<keyof TData>,
) {
  return React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) =>
      fields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [fields, rows, search]);
}
