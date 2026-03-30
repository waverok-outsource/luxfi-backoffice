"use client";

import * as React from "react";
import { format } from "date-fns";

import type { AddRoleFormValues } from "@/schema/system-settings.schema";
import {
  rolePermissionModules,
  rolePermissionSettings as seededRolePermissionSettings,
  type RolePermissionAccess,
  type RolePermissionModuleKey,
  type RolePermissionRecord,
} from "@/module/dashboard/system-settings/data";

const ROLE_PERMISSIONS_STORAGE_KEY = "luxfi:role-permissions";

function createEmptyPermissionMap() {
  return Object.fromEntries(
    rolePermissionModules.map((module) => [
      module.key,
      { viewerOnly: false, initiatorApprover: false },
    ]),
  ) as AddRoleFormValues["permissions"];
}

function normalizeStoredAccess(
  access: Partial<RolePermissionAccess>[] | undefined,
): RolePermissionAccess[] | null {
  if (!Array.isArray(access)) {
    return null;
  }

  const normalized = access
    .map((item) => {
      if (
        typeof item.moduleKey !== "string" ||
        typeof item.moduleLabel !== "string" ||
        typeof item.viewerOnly !== "boolean" ||
        typeof item.initiatorApprover !== "boolean"
      ) {
        return null;
      }

      return {
        moduleKey: item.moduleKey as RolePermissionModuleKey,
        moduleLabel: item.moduleLabel,
        viewerOnly: item.viewerOnly,
        initiatorApprover: item.initiatorApprover,
      };
    })
    .filter((item): item is RolePermissionAccess => item !== null);

  return normalized.length === rolePermissionModules.length ? normalized : null;
}

function normalizeStoredRole(role: Partial<RolePermissionRecord>): RolePermissionRecord | null {
  if (
    typeof role.id !== "string" ||
    typeof role.roleId !== "string" ||
    typeof role.roleTag !== "string" ||
    typeof role.permissions !== "number" ||
    typeof role.dateAdded !== "string" ||
    typeof role.status !== "string"
  ) {
    return null;
  }

  const access = normalizeStoredAccess(role.access);

  return {
    id: role.id,
    roleId: role.roleId,
    roleTag: role.roleTag,
    permissions: role.permissions,
    dateAdded: role.dateAdded,
    status: role.status === "deactivated" ? "deactivated" : "active",
    access: access ?? seededRolePermissionSettings.find((item) => item.id === role.id)?.access ?? [],
  };
}

function readStoredRoles(): RolePermissionRecord[] {
  if (typeof window === "undefined") {
    return seededRolePermissionSettings;
  }

  try {
    const raw = window.localStorage.getItem(ROLE_PERMISSIONS_STORAGE_KEY);
    if (!raw) {
      return seededRolePermissionSettings;
    }

    const parsed = JSON.parse(raw) as Partial<RolePermissionRecord>[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return seededRolePermissionSettings;
    }

    const normalized = parsed
      .map(normalizeStoredRole)
      .filter((role): role is RolePermissionRecord => role !== null);

    return normalized.length > 0 ? normalized : seededRolePermissionSettings;
  } catch {
    return seededRolePermissionSettings;
  }
}

function buildRoleId(roles: RolePermissionRecord[]) {
  return String(
    roles.reduce((max, role) => {
      const roleNumber = Number(role.roleId);
      return Number.isFinite(roleNumber) ? Math.max(max, roleNumber) : max;
    }, 8909554220) + 1,
  );
}

function countSelectedPermissions(access: RolePermissionAccess[]) {
  return access.filter((permission) => permission.viewerOnly || permission.initiatorApprover).length;
}

function buildAccessFromValues(values: AddRoleFormValues["permissions"]) {
  return rolePermissionModules.map((module) => {
    const selection = values[module.key] ?? { viewerOnly: false, initiatorApprover: false };

    return {
      moduleKey: module.key,
      moduleLabel: module.label,
      viewerOnly: Boolean(selection.viewerOnly),
      initiatorApprover: Boolean(selection.initiatorApprover),
    };
  });
}

export function getRolePermissionFormDefaults(role: RolePermissionRecord): AddRoleFormValues {
  const defaults = createEmptyPermissionMap();

  role.access.forEach((permission) => {
    defaults[permission.moduleKey] = {
      viewerOnly: permission.viewerOnly,
      initiatorApprover: permission.initiatorApprover,
    };
  });

  return {
    role: role.roleTag,
    permissions: defaults,
  };
}

export function useRolePermissionsStore() {
  const [roles, setRoles] = React.useState<RolePermissionRecord[]>(readStoredRoles);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(ROLE_PERMISSIONS_STORAGE_KEY, JSON.stringify(roles));
    } catch {
      // ignore persistence failures
    }
  }, [roles]);

  const addRole = React.useCallback((values: AddRoleFormValues) => {
    setRoles((currentRoles) => {
      const roleId = buildRoleId(currentRoles);
      const access = buildAccessFromValues(values.permissions);

      return [
        {
          id: roleId,
          roleId,
          roleTag: values.role.trim(),
          permissions: countSelectedPermissions(access),
          dateAdded: format(new Date(), "dd - MM - yyyy"),
          status: "active",
          access,
        },
        ...currentRoles,
      ];
    });
  }, []);

  const updateRole = React.useCallback((roleId: string, values: AddRoleFormValues) => {
    setRoles((currentRoles) =>
      currentRoles.map((role) => {
        if (role.id !== roleId) {
          return role;
        }

        const access = buildAccessFromValues(values.permissions);

        return {
          ...role,
          roleTag: values.role.trim(),
          permissions: countSelectedPermissions(access),
          access,
        };
      }),
    );
  }, []);

  const setRoleStatus = React.useCallback(
    (roleId: string, status: RolePermissionRecord["status"]) => {
      setRoles((currentRoles) =>
        currentRoles.map((role) => (role.id === roleId ? { ...role, status } : role)),
      );
    },
    [],
  );

  const getRoleById = React.useCallback(
    (roleId: string) => roles.find((role) => role.id === roleId) ?? null,
    [roles],
  );

  return {
    roles,
    addRole,
    updateRole,
    setRoleStatus,
    getRoleById,
  };
}
