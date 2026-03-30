"use client";

import * as React from "react";
import { Search, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useURLTableSearch } from "@/hooks/useURLTableSearch";
import {
  AddRoleModal,
  EditRoleModal,
} from "@/module/dashboard/system-settings/components/modals/add-role-modal";
import { RolesPermissionsTable } from "@/module/dashboard/system-settings/components/tables/roles-permissions-table";
import {
  getRolePermissionFormDefaults,
  useRolePermissionsStore,
} from "@/module/dashboard/system-settings/hooks/use-role-permissions-store";
import type { RolePermissionRecord } from "@/module/dashboard/system-settings/data";
import type { AddRoleFormValues } from "@/schema/system-settings.schema";

export function RolesPermissionsSection() {
  const { search, setSearch } = useURLTableSearch();
  const [isAddRoleOpen, setIsAddRoleOpen] = React.useState(false);
  const [editingRoleId, setEditingRoleId] = React.useState<string | null>(null);
  const { roles, addRole, updateRole, setRoleStatus, getRoleById } = useRolePermissionsStore();
  const activeRole = editingRoleId ? getRoleById(editingRoleId) : null;

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search role tag or ID"
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

            <Button type="button" className="h-12 rounded-2xl px-5" onClick={() => setIsAddRoleOpen(true)}>
              Add New Role
            </Button>
          </div>
        </div>

        <RolesPermissionsTable roles={roles} onEdit={(role: RolePermissionRecord) => setEditingRoleId(role.id)} />
      </div>

      {isAddRoleOpen ? (
        <AddRoleModal
          open={isAddRoleOpen}
          onOpenChange={setIsAddRoleOpen}
          onSave={(values: AddRoleFormValues) => addRole(values)}
        />
      ) : null}

      {activeRole ? (
        <EditRoleModal
          open={Boolean(activeRole)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingRoleId(null);
            }
          }}
          status={activeRole.status}
          initialValues={getRolePermissionFormDefaults(activeRole)}
          onSave={(values: AddRoleFormValues) => updateRole(activeRole.id, values)}
          onDeactivate={() => {
            setRoleStatus(activeRole.id, "deactivated");
            setEditingRoleId(null);
          }}
          onReactivate={() => {
            setRoleStatus(activeRole.id, "active");
            setEditingRoleId(null);
          }}
        />
      ) : null}
    </>
  );
}
