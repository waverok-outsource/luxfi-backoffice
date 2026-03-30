"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { EditTeamMemberModal } from "@/module/dashboard/system-settings/components/modals/add-team-member-modal";
import { useTeamMembersStore, getTeamMemberFormDefaults } from "@/module/dashboard/system-settings/hooks/use-team-members-store";
import { TeamMemberDetailsTabs } from "@/module/dashboard/system-settings/member-details/components/team-member-details-tabs";
import { TeamMemberOverviewCard } from "@/module/dashboard/system-settings/member-details/components/team-member-overview-card";
import type { AddTeamMemberFormValues } from "@/schema/system-settings.schema";

function TeamMemberStatusBanner() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-alertSoft-error px-4 py-4 text-text-red">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <p className="text-base font-semibold">This user account has been deactivated</p>
    </div>
  );
}

export function TeamMemberDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const memberRouteId =
    params && typeof params.id === "string" ? decodeURIComponent(params.id) : "unknown";
  const { getMemberById, updateMember, setMemberStatus } = useTeamMembersStore();
  const member = getMemberById(memberRouteId);
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  if (!member) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="Team member Details"
          entityId={memberRouteId}
          onBack={() => router.back()}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Team member record not found.
        </div>
      </div>
    );
  }

  const handleSave = (values: AddTeamMemberFormValues) => {
    updateMember(member.id, values);
  };

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="Team member Details"
        entityId={member.id}
        onBack={() => router.back()}
      />

      {member.status === "deactivated" ? <TeamMemberStatusBanner /> : null}

      <TeamMemberOverviewCard
        member={member}
        onEdit={() => setIsEditOpen(true)}
        onToggleStatus={() =>
          setMemberStatus(member.id, member.status === "active" ? "deactivated" : "active")
        }
      />

      <TeamMemberDetailsTabs
        memberId={member.id}
        memberName={member.memberName}
        memberRole={member.assignedRole}
      />

      {isEditOpen ? (
        <EditTeamMemberModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          initialValues={getTeamMemberFormDefaults(member)}
          onSave={handleSave}
        />
      ) : null}
    </div>
  );
}
