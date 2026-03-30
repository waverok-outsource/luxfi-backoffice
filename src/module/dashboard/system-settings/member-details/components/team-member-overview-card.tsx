"use client";

import { AlertTriangle, BadgeCheck, PencilLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMemberRecord } from "@/module/dashboard/system-settings/data";

type TeamMemberOverviewCardProps = {
  member: TeamMemberRecord;
  onEdit: () => void;
  onToggleStatus: () => void;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 text-sm md:grid-cols-[160px_minmax(0,1fr)]">
      <span className="text-text-grey">{label}</span>
      <span className="truncate text-right font-medium text-text-black">{value}</span>
    </div>
  );
}

export function TeamMemberOverviewCard({
  member,
  onEdit,
  onToggleStatus,
}: TeamMemberOverviewCardProps) {
  const isDeactivated = member.status === "deactivated";

  return (
    <div className="grid gap-4 xl:grid-cols-[160px_minmax(0,1fr)_180px]">
      <article className="relative overflow-hidden rounded-2xl bg-[#dfe8ec]">
        <div className="flex h-full min-h-[150px] items-end justify-center">
          <div className="relative h-[104px] w-[104px] rounded-t-full bg-primary-white/95">
            <div className="absolute -top-[70px] left-1/2 h-[62px] w-[62px] -translate-x-1/2 rounded-full bg-primary-white" />
          </div>
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge variant={isDeactivated ? "error" : "success"} showStatusDot>
            {isDeactivated ? "Deactivated" : "Active"}
          </Badge>
        </div>
      </article>

      <article className="rounded-2xl bg-primary-white px-5 py-4">
        <h2 className="text-[28px] font-semibold leading-tight text-text-black">
          Employee Information
        </h2>

        <div className="mt-4 space-y-3">
          <DetailRow label="Full Name:" value={member.memberName} />
          <DetailRow label="Email Address:" value={member.emailAddress} />
          <DetailRow
            label="Role (Department):"
            value={`${member.assignedRole} (${member.department})`}
          />
          <DetailRow label="Member Since:" value={member.memberSinceLabel} />
        </div>
      </article>

      <div className="flex flex-col justify-start gap-3">
        <Button type="button" variant="gold" className="h-12 rounded-2xl" onClick={onEdit}>
          <PencilLine className="h-5 w-5" />
          Edit Details
        </Button>

        {isDeactivated ? (
          <Button
            type="button"
            variant="success"
            className="h-12 rounded-2xl"
            onClick={onToggleStatus}
          >
            <BadgeCheck className="h-5 w-5" />
            Re-activate User
          </Button>
        ) : (
          <Button
            type="button"
            variant="danger"
            className="h-12 rounded-2xl"
            onClick={onToggleStatus}
          >
            <AlertTriangle className="h-5 w-5" />
            Deactivate User
          </Button>
        )}
      </div>
    </div>
  );
}
