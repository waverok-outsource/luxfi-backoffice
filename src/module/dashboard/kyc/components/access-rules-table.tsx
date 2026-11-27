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
import {
  isEndpointMissing,
  resourceTitle,
  ruleTargetTitle,
  targetTypeLabel,
  tierLabel,
} from "@/module/dashboard/kyc/access";
import { PAGE_SIZE } from "@/module/dashboard/kyc/data";
import { useKycAccessResources, useKycAccessRules } from "@/services/queries/kyc-access.queries";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset } from "@/util/helper";
import route from "@/util/route";

type AccessRulesQuery = {
  page?: string;
  status?: string;
  resource?: string;
  type?: string;
};

type AccessRuleRow = {
  id: string;
  target: string;
  targetType: string;
  endpointMissing: boolean;
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

const TYPE_OPTIONS = [
  { value: "all", label: "All targets" },
  { value: "resource", label: "Resources" },
  { value: "endpoint", label: "Endpoints" },
] as const;

export function AccessRulesTable() {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<AccessRulesQuery>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const status = value.status === "active" || value.status === "inactive" ? value.status : undefined;
  const { data: resourcesResponse } = useKycAccessResources();
  const resources = resourcesResponse?.data ?? [];
  const targetType = value.type === "resource" || value.type === "endpoint" ? value.type : undefined;
  // A resource filter only makes sense for resource rules.
  const resourceId =
    targetType !== "endpoint" && /^[a-f\d]{24}$/i.test(value.resource ?? "") ? value.resource : undefined;

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(targetType ? { targetType } : {}),
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
    target: ruleTargetTitle(rule),
    targetType: targetTypeLabel(rule.targetType),
    endpointMissing: isEndpointMissing(rule),
    description:
      rule.targetType === "endpoint"
        ? rule.endpoint?.key || "-"
        : rule.resource?.description?.trim() || "-",
    tier: tierLabel(rule.minimumKycTier),
    updatedAt: rule.updatedAt ? formatDate(rule.updatedAt, "dd MMM yyyy") : "-",
    isActive: rule.isActive !== false,
  }));

  const columns: ColumnDef<AccessRuleRow, unknown>[] = [
    createSerialColumn<AccessRuleRow>({ offset: serialNumberOffset }),
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) => (
        <div className="flex max-w-[260px] flex-col gap-1">
          <span className="font-semibold">{row.original.target}</span>
          {row.original.endpointMissing ? (
            <Badge variant="warning" title="This route was removed from the backend code">
              Route removed
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "targetType",
      header: "Type",
      cell: ({ getValue }) => <Badge variant="neutral">{String(getValue())}</Badge>,
    },
    createTextColumn<AccessRuleRow>("Details", "description", "block max-w-[280px]"),
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

  const hasFilters = Boolean(status || resourceId || targetType);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Select
          value={targetType ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              type: next === "resource" || next === "endpoint" ? next : undefined,
              resource: next === "endpoint" ? undefined : value.resource,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[170px]" size="sm">
            <SelectValue>
              {(selected: string | null) =>
                TYPE_OPTIONS.find((option) => option.value === selected)?.label ?? "All targets"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          disabled={targetType === "endpoint"}
          value={resourceId ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              resource: next && next !== "all" ? String(next) : undefined,
              type: next && next !== "all" ? "resource" : value.type,
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
