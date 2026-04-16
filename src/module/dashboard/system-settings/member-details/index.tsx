"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { EditTeamMemberModal } from "@/module/dashboard/system-settings/components/modals/add-team-member-modal";
import { TeamMemberDetailsTabs } from "@/module/dashboard/system-settings/member-details/components/team-member-details-tabs";
import { TeamMemberOverviewCard } from "@/module/dashboard/system-settings/member-details/components/team-member-overview-card";
import { useSettingsTeamMember } from "@/services/queries/settings.queries";
import { getFullName, toTitleCase } from "@/util/helper";

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
  const params = useParams<{ id: string }>();
  const memberRouteId = decodeURIComponent(params.id);
  const { data: teamMemberResponse, isLoading } = useSettingsTeamMember(memberRouteId);
  const member = teamMemberResponse?.data ?? null;
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  if (isLoading && !member) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="Team member Details"
          entityId={params.id}
          onBack={() => router.back()}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Loading team member record...
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-4">
        <DetailBreadcrumbHeader
          title="Team member Details"
          entityId={params.id}
          onBack={() => router.back()}
        />
        <div className="rounded-2xl bg-primary-white p-8 text-center text-text-grey">
          Team member record not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="Team member Details"
        entityId={params.id}
        onBack={() => router.back()}
      />

      {member.accountStatus.toLowerCase() !== "active" ? <TeamMemberStatusBanner /> : null}

      <TeamMemberOverviewCard
        member={member}
        onEdit={() => setIsEditOpen(true)}
        onToggleStatus={() => undefined}
      />

      <TeamMemberDetailsTabs
        memberId={member.userRef}
        memberName={getFullName(member)}
        memberRole={toTitleCase(member.roleTitle)}
      />

      {isEditOpen ? (
        <EditTeamMemberModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          initialValues={{
            firstName: member.firstName,
            lastName: member.lastName,
            emailAddress: member.email,
            role: toTitleCase(member.roleTitle),
          }}
          onSave={() => undefined}
        />
      ) : null}
    </div>
  );
}
