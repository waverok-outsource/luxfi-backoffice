"use client";

import { useSyncExternalStore } from "react";

import Storage from "@/util/storage";

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function readPermission(permission: string): boolean | null {
  const permissions = Storage.getUser()?.permissions;
  const granted = permissions?.userPermissions;
  if (!Array.isArray(granted)) return null;

  const titleById = new Map<string, string>();
  (permissions?.systemPermissions ?? []).forEach((group) =>
    (group.permissions ?? []).forEach((item) => titleById.set(item.id, item.title)),
  );

  const target = normalise(permission);
  return granted.some(
    (entry) =>
      typeof entry === "string" &&
      (normalise(entry) === target || normalise(titleById.get(entry) ?? "") === target),
  );
}

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

/**
 * Checks the signed-in admin's stored permissions for `permission` (for example "approvekyc").
 * `userPermissions` may hold permission titles or IDs, so IDs are resolved to titles through
 * `systemPermissions` before comparing.
 *
 * Returns `null` while unknown (during server render, or when no permission data is stored).
 * Callers should treat `null` as "allowed" and rely on the backend's 403, so admins are never
 * locked out because the stored profile is missing data.
 */
export function useHasPermission(permission: string): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => readPermission(permission),
    () => null,
  );
}
