"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, TableSearchField, createSerialColumn, createTextColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { QuoteFeeDialog } from "@/module/dashboard/fees/components/quote-fee-dialog";
import { feeLabel, formatFeeCharge, formatFeeScope, resolveFeeOptions } from "@/module/dashboard/fees/form";
import { useFeeOptions, useFees } from "@/services/queries/fee.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { getSerialNumberOffset } from "@/util/helper";
import route from "@/util/route";

const PAGE_SIZE = 10;

type FeeListQuery = {
  page?: string;
  q?: string;
  trigger?: string;
  feeType?: string;
  bearer?: string;
  scopeLevel?: string;
  isActive?: string;
};

type FeeRow = {
  id: string;
  name: string;
  code: string;
  trigger: string;
  feeType: string;
  bearer: string;
  charge: string;
  scope: string;
  isActive: boolean;
};

export function FeesSection() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<FeeListQuery>();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { data: optionsResponse } = useFeeOptions();
  const options = resolveFeeOptions(optionsResponse?.data);
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const isActive =
    value.isActive === "true" ? "true" : value.isActive === "false" ? "false" : undefined;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(value.trigger ? { trigger: value.trigger } : {}),
    ...(value.feeType ? { feeType: value.feeType } : {}),
    ...(value.bearer ? { bearer: value.bearer } : {}),
    ...(value.scopeLevel ? { scopeLevel: value.scopeLevel } : {}),
    ...(isActive ? { isActive } : {}),
  });

  const { data: response, isLoading } = useFees(query);
  const fees = response?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: FeeRow[] = fees.map((fee) => ({
    id: fee.feeId,
    name: fee.name,
    code: fee.code,
    trigger: feeLabel(fee.trigger),
    feeType: feeLabel(fee.feeType),
    bearer: feeLabel(fee.bearer),
    charge: formatFeeCharge(fee),
    scope: formatFeeScope(fee.scopeLevel, fee.scopeRefs ?? []),
    isActive: fee.isActive,
  }));

  const columns: ColumnDef<FeeRow, unknown>[] = [
    createSerialColumn<FeeRow>({ offset: serialNumberOffset }),
    createTextColumn<FeeRow>("Name", "name", "block max-w-[220px] font-semibold"),
    createTextColumn<FeeRow>("Code", "code"),
    createTextColumn<FeeRow>("Trigger", "trigger"),
    createTextColumn<FeeRow>("Type", "feeType"),
    createTextColumn<FeeRow>("Bearer", "bearer"),
    createTextColumn<FeeRow>("Charge", "charge"),
    createTextColumn<FeeRow>("Scope", "scope"),
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "success" : "disabled"} showStatusDot>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-3 text-sm font-semibold"
          onClick={() => router.push(route.dashboard.fee(row.original.id))}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text-black">Fees</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-grey">
            Add a fee, update it, or turn it on and off. Those changes wait for another authorised user.
            Quoting a transaction does not.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setQuoteOpen(true)}>
            Quote a transaction
          </Button>
          <Button type="button" onClick={() => router.push(route.dashboard.feeNew)}>
            Add fee
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <TableSearchField placeholder="Search name, code, or fee id" className="max-w-md" />
        <FilterSelect
          value={value.trigger}
          placeholder="All triggers"
          choices={options.triggers}
          onChange={(next) => setURLQuery({ trigger: next, page: undefined })}
        />
        <FilterSelect
          value={value.feeType}
          placeholder="All types"
          choices={options.feeTypes}
          onChange={(next) => setURLQuery({ feeType: next, page: undefined })}
        />
        <FilterSelect
          value={value.bearer}
          placeholder="All bearers"
          choices={options.bearers}
          onChange={(next) => setURLQuery({ bearer: next, page: undefined })}
        />
        <FilterSelect
          value={value.scopeLevel}
          placeholder="All scopes"
          choices={options.scopeLevels}
          onChange={(next) => setURLQuery({ scopeLevel: next, page: undefined })}
        />
        <Select
          value={isActive ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              isActive: next === "true" || next === "false" ? next : undefined,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[150px]" size="sm">
            <SelectValue>
              {(selected: string | null) =>
                selected === "true" ? "Active" : selected === "false" ? "Inactive" : "All statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No fees found."
        stickyActionColumn
        pagination={{
          totalEntries: response?.pagination?.total ?? rows.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />

      {quoteOpen ? <QuoteFeeDialog open={quoteOpen} onOpenChange={setQuoteOpen} /> : null}
    </div>
  );
}

function FilterSelect({
  value,
  placeholder,
  choices,
  onChange,
}: {
  value?: string;
  placeholder: string;
  choices: string[];
  onChange: (value: string | undefined) => void;
}) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(next) => onChange(next && next !== "all" ? String(next) : undefined)}
    >
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue>
          {(selected: string | null) => (selected && selected !== "all" ? feeLabel(selected) : placeholder)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {choices.map((choice) => (
          <SelectItem key={choice} value={choice}>
            {feeLabel(choice)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
