import { format } from "date-fns";

export function toTitleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getFullName(member: { firstName: string; lastName: string }) {
  return `${member.firstName} ${member.lastName}`.trim() || "-";
}

export function formatDate(value: string, pattern: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : format(date, pattern);
}

export function getSerialNumberOffset({
  currentPage,
  pageSize,
  pagination,
}: {
  currentPage: number;
  pageSize: number;
  pagination?: { offset?: number | null; perPage?: number | null } | null;
}) {
  return pagination?.offset ?? (Math.max(currentPage, 1) - 1) * (pagination?.perPage ?? pageSize);
}
