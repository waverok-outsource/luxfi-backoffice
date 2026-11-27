"use client";

import { useSyncExternalStore } from "react";

import Storage from "@/util/storage";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * The backend is the authority on permissions; this only decides whether to offer a control.
 * Returns `true` when the session has no permission list stored (older sessions), so we never
 * hide something the user can actually do. Matches ignoring case and separators, so
 * "approvesettings", "approve_settings" and "approveSettings" are all the same permission.
 */
export function hasPermission(permission: string) {
  const list = Storage.getUser()?.permissions?.userPermissions;
  if (!Array.isArray(list)) return true;
  const wanted = normalize(permission);
  return list.some((item) => typeof item === "string" && normalize(item) === wanted);
}

const subscribe = () => () => {};

/** SSR-safe: optimistic on the server, real value after hydration. */
export function usePermission(permission: string) {
  return useSyncExternalStore(
    subscribe,
    () => hasPermission(permission),
    () => true,
  );
}
