"use client";

import * as React from "react";
import { format } from "date-fns";

import type { AddTeamMemberFormValues } from "@/schema/system-settings.schema";
import {
  teamMembers as seededTeamMembers,
  teamRoleDepartments,
  type TeamMemberRecord,
} from "@/module/dashboard/system-settings/data";

const TEAM_MEMBERS_STORAGE_KEY = "luxfi:team-members";

function normalizeStoredMember(member: Partial<TeamMemberRecord>): TeamMemberRecord | null {
  if (
    typeof member.id !== "string" ||
    typeof member.memberId !== "string" ||
    typeof member.memberName !== "string" ||
    typeof member.emailAddress !== "string" ||
    typeof member.assignedRole !== "string" ||
    typeof member.dateAdded !== "string" ||
    typeof member.status !== "string"
  ) {
    return null;
  }

  return {
    id: member.id,
    memberId: member.memberId,
    memberName: member.memberName,
    emailAddress: member.emailAddress,
    assignedRole: member.assignedRole,
    department:
      typeof member.department === "string"
        ? member.department
        : teamRoleDepartments[member.assignedRole as keyof typeof teamRoleDepartments] ?? "Operations",
    dateAdded: member.dateAdded,
    memberSinceLabel:
      typeof member.memberSinceLabel === "string" ? member.memberSinceLabel : "10 January, 2026",
    status: member.status === "deactivated" ? "deactivated" : "active",
  };
}

function readStoredMembers(): TeamMemberRecord[] {
  if (typeof window === "undefined") {
    return seededTeamMembers;
  }

  try {
    const raw = window.localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    if (!raw) {
      return seededTeamMembers;
    }

    const parsed = JSON.parse(raw) as Partial<TeamMemberRecord>[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seededTeamMembers;
    }

    const normalized = parsed
      .map(normalizeStoredMember)
      .filter((member): member is TeamMemberRecord => member !== null);

    return normalized.length > 0 ? normalized : seededTeamMembers;
  } catch {
    return seededTeamMembers;
  }
}

function buildMemberId(members: TeamMemberRecord[]) {
  const maxValue = members.reduce((max, member) => {
    const suffix = Number(member.id.replace(/\D/g, "").slice(-12));
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 802725424232);

  return `CU${String(maxValue + 1)}`;
}

function buildMemberNumber(members: TeamMemberRecord[]) {
  return (
    members.reduce((max, member) => {
      const memberNumber = Number(member.memberId);
      return Number.isFinite(memberNumber) ? Math.max(max, memberNumber) : max;
    }, 8909554220) + 1
  );
}

function splitMemberName(memberName: string) {
  const [firstName = "", ...rest] = memberName.trim().split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" "),
  };
}

export function getTeamMemberFormDefaults(member: TeamMemberRecord): AddTeamMemberFormValues {
  const { firstName, lastName } = splitMemberName(member.memberName);

  return {
    firstName,
    lastName,
    emailAddress: member.emailAddress,
    role: member.assignedRole,
  };
}

export function useTeamMembersStore() {
  const [members, setMembers] = React.useState<TeamMemberRecord[]>(readStoredMembers);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(members));
    } catch {
      // ignore persistence failures
    }
  }, [members]);

  const addMember = React.useCallback((values: AddTeamMemberFormValues) => {
    setMembers((currentMembers) => [
      {
        id: buildMemberId(currentMembers),
        memberId: String(buildMemberNumber(currentMembers)),
        memberName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        emailAddress: values.emailAddress.trim().toLowerCase(),
        assignedRole: values.role,
        department: teamRoleDepartments[values.role as keyof typeof teamRoleDepartments] ?? "Operations",
        dateAdded: format(new Date(), "dd - MM - yyyy"),
        memberSinceLabel: format(new Date(), "dd MMMM, yyyy"),
        status: "active",
      },
      ...currentMembers,
    ]);
  }, []);

  const updateMember = React.useCallback((memberId: string, values: AddTeamMemberFormValues) => {
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              memberName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
              assignedRole: values.role,
              department:
                teamRoleDepartments[values.role as keyof typeof teamRoleDepartments] ?? "Operations",
            }
          : member,
      ),
    );
  }, []);

  const setMemberStatus = React.useCallback(
    (memberId: string, status: TeamMemberRecord["status"]) => {
      setMembers((currentMembers) =>
        currentMembers.map((member) => (member.id === memberId ? { ...member, status } : member)),
      );
    },
    [],
  );

  const getMemberById = React.useCallback(
    (memberId: string) => members.find((member) => member.id === memberId) ?? null,
    [members],
  );

  return {
    members,
    addMember,
    updateMember,
    setMemberStatus,
    getMemberById,
  };
}
