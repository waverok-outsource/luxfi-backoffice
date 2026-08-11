# 15. System Settings

## Status

```
UI:      Complete
API:     Partially integrated (team members, roles, permissions wired)
Overall: In progress
```

## Purpose

Platform administration: manage team members, roles and permissions, audit settings activity. Includes team member detail views with session logs and user activity logs.

---

## Routes

| Route | Page |
|-------|------|
| `/system-settings` | System settings dashboard |
| `/system-settings/[id]` | Team member detail |

---

## UI Inventory

### System Settings dashboard (`/system-settings`)

**Header:** "System Settings"

**Toolbar:** Analytics toolbar with date filter and export.

**Metrics section (`TeamManagementMetrics`):**
- Team Members count (with online/offline split)
- Roles count
- Assigned Roles count
- Uses `useSettingsAnalytics()` — API connected.

**Tabs (2):**

#### 1. Team Management (default)

**Table columns:**
- S/N
- Member (name + email)
- Role Title
- Account Status (badge: active/inactive/blacklist/locked/deactivate)
- Date Joined
- Actions (view → navigates to `/system-settings/[id]`)

**Action slot:** "Add a Team Member" button → opens `AddTeamMemberModal`
- Form fields: email, first name, last name, role (select from roles list)
- Submit calls `createTeamMember` mutation

**Data source:** `useSettingsTeamMembers(query)` — API connected.

#### 2. Roles & Permission Settings

**Roles section:**
- Each role card shows: title, permissions count, status badge, created date
- Click opens edit modal (`AddRoleModal` in edit mode)
- Uses `useSettingsRoles()` — API connected

**Permissions section:**
- Resource groups with permission checkboxes
- Uses `useSettingsPermissions()` — API connected

**Action slot:** "Add New Role" button → opens `AddRoleModal` (create mode)
- Form: title + multi-select permissions
- Submit calls `createRole` mutation

### Team Member Detail (`/system-settings/[id]`)

**Header:** Breadcrumb with member name, back navigation

**Overview card (`TeamMemberOverviewCard`):**
- Member info: email, status badge, role, role ID, user ref, joined date
- Uses `useSettingsTeamMember(id)` — API connected
- Edit button opens `AddTeamMemberModal` in edit mode
- Status update dropdown (active/inactive/blacklist/locked/deactivate)

**Tabs:**
1. Session Logs — device, IP, channel, location, activity, timestamp. Uses `useSettingsTeamMemberSessionLogs`.
2. User Activity Log — message, status, event, resource, IP, timestamp. Uses `useSettingsTeamMemberActivityLogs`.

Both API connected.

---

## UI States

### Loading
- DataTable skeleton rows
- Detail queries use `enabled` guard

### Empty
DataTable default empty state.

### Error
Toast on mutation failures. Query errors suppressed.

---

## API Requirements

### Already integrated

| Operation | Method | Endpoint | Status |
|-----------|--------|----------|--------|
| Analytics | GET | `/v1/analytics/system-settings` | ✅ |
| List team members | GET | `/v1/users?userType=platform` | ✅ |
| Get team member | GET | `/v1/users/:id` | ✅ |
| Create team member | POST | `/v1/users` | ✅ |
| Update team member | PATCH | `/v1/users/:id` | ✅ |
| List roles | GET | `/v1/roles` | ✅ |
| Create role | POST | `/v1/roles` | ✅ |
| Update role | PATCH | `/v1/roles/:id` | ✅ |
| List permissions | GET | `/v1/permissions` | ✅ |
| Team member session logs | GET | `/v1/users/:id/session-logs` | ✅ |
| Team member activity logs | GET | `/v1/users/:id/activities` | ✅ |

---

## Queries

| Query | Status |
|-------|--------|
| `useSettingsAnalytics()` | ✅ |
| `useSettingsTeamMembers(query)` | ✅ |
| `useSettingsTeamMember(id)` | ✅ |
| `useSettingsRoles(query)` | ✅ |
| `useSettingsPermissions()` | ✅ |
| `useSettingsTeamMemberSessionLogs(id, query)` | ✅ |
| `useSettingsTeamMemberActivityLogs(id, query)` | ✅ |

## Mutations

| Mutation | Status |
|----------|--------|
| `createRole` | ✅ |
| `createTeamMember` | ✅ |
| `updateTeamMemberDetails` | ✅ |
| `updateRoleDetails` | ✅ |
| `updateRoleStatus` | ✅ |

---

## Implementation Backlog

### API Implementation
- [ ] Verify audit log tab (if applicable) uses correct resource identifier for `useAuditLogs`

### Completion / Cleanup
- [ ] No significant cleanup needed — this module is well-integrated
