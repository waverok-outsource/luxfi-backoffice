"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, createSerialColumn, createTextColumn } from "@/components/table";
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
import { resourceTitle, tierLabel } from "@/module/dashboard/kyc/access";
import { PAGE_SIZE } from "@/module/dashboard/kyc/data";
import { useKycAccessResources, useKycAccessRules } from "@/services/queries/kyc-access.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";
import route from "@/util/route";

type AccessRulesQuery = {
  page?: string;
  status?: string;
  resource?: string;
};

type AccessRuleRow = {
  id: string;
  resource: string;
  description: string;
  tier: string;
  updatedAt: string;
  isActive: boolean;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export function AccessRulesTable() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<AccessRulesQuery>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const status = value.status === "active" || value.status === "inactive" ? value.status : undefined;
  const { data: resourcesResponse } = useKycAccessResources();
  const resources = resourcesResponse?.data ?? [];
  const resourceId = /^[a-f\d]{24}$/i.test(value.resource ?? "") ? value.resource : undefined;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(resourceId ? { resourceId } : {}),
    ...(status ? { isActive: status === "active" ? "true" : "false" } : {}),
  });

  const { data: response, isLoading } = useKycAccessRules(query);
  const rules = response?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: AccessRuleRow[] = rules.map((rule) => ({
    id: rule.kycAccessRef,
    resource: resourceTitle(rule.resource?.title),
    description: rule.resource?.description?.trim() || "-",
    tier: tierLabel(rule.minimumKycTier),
    updatedAt: rule.updatedAt ? formatDate(rule.updatedAt, "dd MMM yyyy") : "-",
    isActive: rule.isActive !== false,
  }));

  const columns: ColumnDef<AccessRuleRow, unknown>[] = [
    createSerialColumn<AccessRuleRow>({ offset: serialNumberOffset }),
    createTextColumn<AccessRuleRow>("Resource", "resource", "block max-w-[220px] font-semibold"),
    createTextColumn<AccessRuleRow>("Description", "description", "block max-w-[280px]"),
    createTextColumn<AccessRuleRow>("Minimum tier", "tier", "block max-w-[240px]"),
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? "success" : "disabled"} showStatusDot>
          {getValue() ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    createTextColumn<AccessRuleRow>("Updated", "updatedAt"),
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-3 text-sm font-semibold"
          onClick={() => router.push(route.dashboard.kycResourceAccessRule(row.original.id))}
        >
          View
        </Button>
      ),
    },
  ];

  const hasFilters = Boolean(status || resourceId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Select
          value={resourceId ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              resource: next && next !== "all" ? String(next) : undefined,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[220px]" size="sm">
            <SelectValue>
              {(selected: string | null) => {
                if (!selected || selected === "all") return "All resources";
                const resource = resources.find((item) => item.resourceRef === selected);
                return resource ? resourceTitle(resource.title) : "All resources";
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All resources</SelectItem>
            {resources.map((resource) => (
              <SelectItem key={resource.resourceRef} value={resource.resourceRef}>
                {resourceTitle(resource.title)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              status: next === "active" || next === "inactive" ? next : undefined,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[170px]" size="sm">
            <SelectValue>
              {(selected: string | null) =>
                STATUS_OPTIONS.find((option) => option.value === selected)?.label ?? "All statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel={
          hasFilters ? "No access rules match these filters." : "No KYC access rules yet."
        }
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
