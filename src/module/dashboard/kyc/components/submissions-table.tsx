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
import { PAGE_SIZE, submissionStatusMeta } from "@/module/dashboard/kyc/data";
import { useKycSubmissions, useKycTiers } from "@/services/queries/kyc.queries";
import { KYC_SUBMISSION_STATUSES } from "@/types/kyc.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { formatDate, getSerialNumberOffset, toTitleCase } from "@/util/helper";
import route from "@/util/route";

type SubmissionQuery = {
  page?: string;
  status?: string;
  tier?: string;
};

type SubmissionRow = {
  id: string;
  customer: string;
  tier: string;
  status: string;
  submittedAt: string;
  progress: string;
};

type SubmissionsTableProps = {
  kycTierId?: string;
};

export function SubmissionsTable({ kycTierId }: SubmissionsTableProps) {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<SubmissionQuery>();
  const currentPage = Number(value.page) > 0 ? Number(value.page) : 1;
  const status = KYC_SUBMISSION_STATUSES.find((item) => item === value.status);
  const selectedTier = kycTierId || value.tier || "";

  const { data: tiersResponse } = useKycTiers("limit=100");
  const tiers = [...(tiersResponse?.data ?? [])].sort((a, b) => a.tierNumber - b.tierNumber);
  const tierTitle = new Map(tiers.map((tier) => [tier.kycRef, tier.title]));

  const query = convertObjectToQuery({
    page: String(currentPage),
    limit: String(PAGE_SIZE),
    ...(status ? { status } : {}),
    ...(selectedTier ? { kycTierId: selectedTier } : {}),
  });

  const { data: response, isLoading } = useKycSubmissions(query);
  const submissions = response?.data ?? [];
  const serialNumberOffset = getSerialNumberOffset({
    currentPage,
    pageSize: PAGE_SIZE,
    pagination: response?.pagination,
  });

  const rows: SubmissionRow[] = submissions.map((submission) => {
    const approved = submission.requirements.filter((item) => item.status === "approved").length;
    return {
      id: submission.submissionRef,
      customer: submission.customer?.name?.trim() || "Unknown customer",
      tier: tierTitle.get(submission.kycTierId) || `Tier ${submission.tierNumber}`,
      status: submission.status,
      submittedAt: submission.submittedAt
        ? formatDate(submission.submittedAt, "dd MMM yyyy, h:mm a")
        : "-",
      progress: `${approved}/${submission.requirements.length}`,
    };
  });

  const columns: ColumnDef<SubmissionRow, unknown>[] = [
    createSerialColumn<SubmissionRow>({ offset: serialNumberOffset }),
    createTextColumn<SubmissionRow>("Customer", "customer", "block max-w-[200px] font-semibold"),
    createTextColumn<SubmissionRow>("Tier", "tier", "block max-w-[180px]"),
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const meta = submissionStatusMeta(String(getValue() ?? ""));
        return (
          <Badge variant={meta.variant} showStatusDot>
            {meta.label}
          </Badge>
        );
      },
    },
    createTextColumn<SubmissionRow>("Submitted", "submittedAt"),
    createTextColumn<SubmissionRow>("Approved", "progress"),
    {
      id: "rowActions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-3 text-sm font-semibold"
          onClick={() => {
            const from =
              typeof window === "undefined"
                ? route.dashboard.kyc
                : `${window.location.pathname}${window.location.search}`;
            router.push(
              `${route.dashboard.kycSubmission(row.original.id)}?from=${encodeURIComponent(from)}`,
            );
          }}
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {kycTierId ? null : (
          <Select
            value={selectedTier || "all"}
            onValueChange={(next) =>
              setURLQuery({
                tier: next && next !== "all" ? String(next) : undefined,
                page: undefined,
              })
            }
          >
            <SelectTrigger className="w-[220px]" size="sm">
              <SelectValue>
                {(selected: string | null) => {
                  if (!selected || selected === "all") return "All tiers";
                  return tierTitle.get(selected) ?? "Selected tier";
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              {tiers.map((tier) => (
                <SelectItem key={tier.kycRef} value={tier.kycRef}>
                  {tier.tierNumber}. {tier.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={status ?? "all"}
          onValueChange={(next) =>
            setURLQuery({
              status: next && next !== "all" ? String(next) : undefined,
              page: undefined,
            })
          }
        >
          <SelectTrigger className="w-[170px]" size="sm">
            <SelectValue>
              {(selected: string | null) =>
                selected && selected !== "all" ? toTitleCase(selected) : "All statuses"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {KYC_SUBMISSION_STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {toTitleCase(item)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No KYC submissions found."
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
