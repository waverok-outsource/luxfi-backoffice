"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, TableSearchField, createSerialColumn, createTextColumn } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { PAGE_SIZE, SEVERITY_BADGE } from "@/module/dashboard/kyc/data";
import { severityLabel } from "@/module/dashboard/kyc/form";
import { useKycTiers } from "@/services/queries/kyc.queries";
import { KYC_SEVERITIES } from "@/types/kyc.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";
import route from "@/util/route";

type ConfigurationQuery = {
  page?: string;
  q?: string;
  severity?: string;
};

type ConfigurationRow = {
  id: string;
  title: string;
  tierNumber: string;
  severity: string;
  riskBand: string;
  requirements: string;
  updatedAt: string;
  isActive: boolean;
};

export function ConfigurationsTable() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<ConfigurationQuery>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const search = (value.q ?? "").trim();
  const severity = KYC_SEVERITIES.find((item) => item === value.severity);

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(search ? { q: search } : {}),
    ...(severity ? { severity } : {}),
  });

  const { data: response, isLoading } = useKycTiers(query);
  const tiers = response?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: ConfigurationRow[] = tiers.map((tier) => ({
    id: tier.kycRef,
    title: tier.title,
    tierNumber: String(tier.tierNumber),
    severity: tier.severity,
    riskBand: tier.riskBand ? `${tier.riskBand.min}–${tier.riskBand.max}` : "-",
    requirements: String(tier.requirements?.length ?? 0),
    updatedAt: tier.updatedAt ? formatDate(tier.updatedAt, "dd MMM yyyy") : "-",
    isActive: tier.isActive !== false,
  }));

  const columns: ColumnDef<ConfigurationRow, unknown>[] = [
    createSerialColumn<ConfigurationRow>({ offset: serialNumberOffset }),
    createTextColumn<ConfigurationRow>("Title", "title", "block max-w-[220px] font-semibold"),
    createTextColumn<ConfigurationRow>("Tier", "tierNumber"),
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ getValue }) => {
        const severityValue = String(getValue() ?? "");
        const badge = SEVERITY_BADGE[severityValue as keyof typeof SEVERITY_BADGE];
        return (
          <Badge variant={badge?.variant ?? "neutral"} showStatusDot>
            {badge?.label ?? severityLabel(severityValue)}
          </Badge>
        );
      },
    },
    createTextColumn<ConfigurationRow>("Risk band", "riskBand"),
    createTextColumn<ConfigurationRow>("Requirements", "requirements"),
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "success" : "disabled"} showStatusDot>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    createTextColumn<ConfigurationRow>("Updated", "updatedAt"),
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-3 text-sm font-semibold"
          onClick={() => router.push(route.dashboard.kycConfiguration(row.original.id))}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TableSearchField placeholder="Search configuration title" className="max-w-md" />
        <Select
          value={severity ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              severity: next && next !== "all" ? String(next) : undefined,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[170px]" size="sm">
            <SelectValue>
              {(selected: string | null) =>
                selected && selected !== "all" ? severityLabel(selected) : "All severities"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            {KYC_SEVERITIES.map((item) => (
              <SelectItem key={item} value={item}>
                {severityLabel(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No KYC configurations found."
        stickyActionColumn
        pagination={{
          totalEntries: response?.pagination?.total ?? rows.length,
          pageSize: PAGE_SIZE,
          maxVisiblePages: 3,
        }}
      />
    </div>
  );
}
