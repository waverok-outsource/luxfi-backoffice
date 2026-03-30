"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import { AddTeamMemberModal } from "@/module/dashboard/system-settings/components/modals/add-team-member-modal";
import { TeamManagementTable } from "@/module/dashboard/system-settings/components/tables/team-management-table";
import { useTeamMembersStore } from "@/module/dashboard/system-settings/hooks/use-team-members-store";
import type { AddTeamMemberFormValues } from "@/schema/system-settings.schema";

export function TeamManagementSection() {
  const { search, setSearch } = useURLTableSearch();
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = React.useState(false);
  const { members, addMember } = useTeamMembersStore();

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search user name or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              startAdornment={<Search className="h-5 w-5 text-text-grey" />}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-2xl border border-primary-grey-stroke bg-primary-white px-4 text-text-grey hover:bg-primary-grey-undertone"
            >
              Filter Options
              <ChevronDown className="h-4 w-4 text-text-grey" />
            </Button>

            <Button
              type="button"
              className="h-12 rounded-2xl px-5"
              onClick={() => setIsAddTeamMemberOpen(true)}
            >
              Add New Member
            </Button>
          </div>
        </div>

        <TeamManagementTable members={members} />
      </div>

      {isAddTeamMemberOpen && (
        <AddTeamMemberModal
          open={isAddTeamMemberOpen}
          onOpenChange={setIsAddTeamMemberOpen}
          onInvite={(values: AddTeamMemberFormValues) => addMember(values)}
        />
      )}
    </>
  );
}
