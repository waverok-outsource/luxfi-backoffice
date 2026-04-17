"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField } from "@/components/util/form-controller";
import { addRoleSchema, type AddRoleFormValues } from "@/schema/system-settings.schema";
import useSettingsFns from "@/services/functions/settings.fns";
import { useSettingsPermissions } from "@/services/queries/settings.queries";
import type { SettingsPermissionResourceType, SettingsRoleType } from "@/types/settings.type";
import { toTitleCase } from "@/util/helper";

type AddRoleStage = "FORM" | "SUCCESS";

type RoleSuccessKind = "create" | "update" | "deactivate" | "activate";

const ROLE_SUCCESS_COPY: Record<RoleSuccessKind, { title: string; description: string }> = {
  create: {
    title: "Role created",
    description: "The new role has been saved with the permissions you selected.",
  },
  update: {
    title: "Role updated",
    description: "Changes to this role and its permissions have been saved.",
  },
  deactivate: {
    title: "Role deactivated",
    description: "This role is inactive and cannot be assigned until it is reactivated.",
  },
  activate: {
    title: "Role reactivated",
    description: "This role is active again and can be assigned to team members.",
  },
};

const EMPTY_PERMISSION_GROUPS: SettingsPermissionResourceType[] = [];

type RoleFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  role?: SettingsRoleType;
};

function createDefaultPermissions(
  permissionGroups: SettingsPermissionResourceType[] = [],
): AddRoleFormValues["permissions"] {
  return Object.fromEntries(
    permissionGroups.map((group) => [
      group.resourceId,
      { viewerOnly: false, initiatorApprover: false },
    ]),
  ) as AddRoleFormValues["permissions"];
}

function getPermissionByAction(group: SettingsPermissionResourceType, action: "view" | "approve") {
  return group.permissions.find((permission) => permission.title.toLowerCase().startsWith(action));
}

function getRolePermissionFormDefaults(
  role: SettingsRoleType | undefined,
  permissionGroups: SettingsPermissionResourceType[],
): AddRoleFormValues {
  const permissions = createDefaultPermissions(permissionGroups);
  const selectedPermissionIds = new Set(role?.permissions.map((permission) => permission.id) ?? []);

  permissionGroups.forEach((group) => {
    const viewPermission = getPermissionByAction(group, "view");
    const approvePermission = getPermissionByAction(group, "approve");
    const hasViewPermission = viewPermission ? selectedPermissionIds.has(viewPermission.id) : false;
    const hasApprovePermission = approvePermission
      ? selectedPermissionIds.has(approvePermission.id)
      : false;

    permissions[group.resourceId] = {
      viewerOnly: hasViewPermission && !hasApprovePermission,
      initiatorApprover: hasApprovePermission,
    };
  });

  return {
    role: role?.title ?? "",
    permissions,
  };
}

function buildRoleDetailsPayload(
  values: AddRoleFormValues,
  permissionGroups: SettingsPermissionResourceType[],
) {
  return {
    title: values.role.trim(),
    permissions: getSelectedPermissionIds(values, permissionGroups),
  };
}

function getSelectedPermissionIds(
  values: AddRoleFormValues,
  permissionGroups: SettingsPermissionResourceType[],
) {
  return permissionGroups.flatMap((group) => {
    const selection = values.permissions[group.resourceId];
    if (!selection) {
      return [];
    }

    if (selection.initiatorApprover) {
      const approvePermission = getPermissionByAction(group, "approve");
      return approvePermission ? [approvePermission.id] : [];
    }

    if (selection.viewerOnly) {
      const viewPermission = getPermissionByAction(group, "view");
      return viewPermission ? [viewPermission.id] : [];
    }

    return [];
  });
}

function PermissionRows({
  disabled,
  permissionGroups,
  permissions,
  setValue,
}: {
  disabled: boolean;
  permissionGroups: SettingsPermissionResourceType[];
  permissions: AddRoleFormValues["permissions"];
  setValue: ReturnType<typeof useForm<AddRoleFormValues>>["setValue"];
}) {
  return permissionGroups.map((group) => {
    const groupPermissions = permissions[group.resourceId] ?? {
      viewerOnly: false,
      initiatorApprover: false,
    };
    const viewPermission = getPermissionByAction(group, "view");
    const approvePermission = getPermissionByAction(group, "approve");

    return (
      <div
        key={group.resourceId}
        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
      >
        <span className="font-medium text-text-black">{toTitleCase(group.resourceTitle)}</span>

        <label className="inline-flex items-center gap-3 text-sm text-text-grey">
          <Switch
            size="sm"
            tone="success"
            checked={groupPermissions.viewerOnly}
            disabled={disabled || !viewPermission}
            onCheckedChange={(checked) => {
              setValue(`permissions.${group.resourceId}.viewerOnly`, Boolean(checked), {
                shouldDirty: true,
                shouldValidate: true,
              });

              if (checked) {
                setValue(`permissions.${group.resourceId}.initiatorApprover`, false, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
          <span>Viewer only</span>
        </label>

        <label className="inline-flex items-center gap-3 text-sm text-text-grey">
          <Switch
            size="sm"
            tone="success"
            checked={groupPermissions.initiatorApprover}
            disabled={disabled || !approvePermission}
            onCheckedChange={(checked) => {
              setValue(`permissions.${group.resourceId}.initiatorApprover`, Boolean(checked), {
                shouldDirty: true,
                shouldValidate: true,
              });

              if (checked) {
                setValue(`permissions.${group.resourceId}.viewerOnly`, false, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
          />
          <span>Initiator/Approver</span>
        </label>
      </div>
    );
  });
}

function PermissionRowsSkeleton() {
  return Array.from({ length: 4 }).map((_, index) => (
    <div key={index} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
      <Skeleton className="h-5 w-40 rounded-full" />
      <Skeleton className="h-6 w-28 rounded-full" />
      <Skeleton className="h-6 w-36 rounded-full" />
    </div>
  ));
}

function RoleFormModal({ open, onOpenChange, mode = "add", role }: RoleFormModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddRoleStage>("FORM");
  const [successKind, setSuccessKind] = React.useState<RoleSuccessKind>("create");
  const formId = React.useId();

  const goToSuccess = (kind: RoleSuccessKind) => {
    setSuccessKind(kind);
    setCurrentStage("SUCCESS");
  };

  const isDeactivated = role?.status === "inactive";
  const { data: permissionsResponse, isLoading: isPermissionsLoading } = useSettingsPermissions();
  const permissionGroups = permissionsResponse?.data ?? EMPTY_PERMISSION_GROUPS;
  const { createRole, updateRoleDetails, updateRoleStatus, loading } = useSettingsFns();
  const isSavingForm = loading.CREATE_ROLE || loading.UPDATE_ROLE_DETAILS;
  const isStatusUpdating = loading.UPDATE_ROLE_STATUS;

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: getRolePermissionFormDefaults(role, permissionGroups),
    mode: "all",
  });

  const permissions =
    useWatch({
      control,
      name: "permissions",
    }) ?? {};
  const permissionsError =
    typeof errors.permissions?.message === "string" ? errors.permissions.message : undefined;

  const config =
    mode === "edit"
      ? {
          title: "Edit Role",
          description: "Edit role access to back-office",
          submitLabel: "Save",
        }
      : {
          title: "Add New Role",
          description: "Fill details to add new role access to back-office",
          submitLabel: "Save",
        };

  const handleFormSubmit = async (values: AddRoleFormValues) => {
    const payload = buildRoleDetailsPayload(values, permissionGroups);

    if (mode === "add") {
      await createRole(payload, () => goToSuccess("create"));
      return;
    }

    if (mode === "edit" && role?.roleId) {
      await updateRoleDetails(role.roleId, payload, () => goToSuccess("update"));
      return;
    }
  };

  const toggleRoleStatus = async () => {
    if (!role?.roleId) {
      return;
    }
    const nextStatus = role.status === "inactive" ? "active" : "inactive";
    const kind: RoleSuccessKind = nextStatus === "inactive" ? "deactivate" : "activate";
    await updateRoleStatus(role.roleId, nextStatus, () => goToSuccess(kind));
  };

  const stageConfig: Record<
    AddRoleStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: false,
      contentClassName: `${mode === "edit" ? "max-w-[650px]" : "max-w-[560px]"} p-4`,
      content: (
        <div className="space-y-5">
          <ModalShell.Header
            title={config.title}
            description={config.description}
            showBackButton
            onBack={() => onOpenChange(false)}
            titleClassName="text-[24px] sm:text-[32px]"
          />

          <ModalShell.Body className="rounded-2xl px-4 py-5 sm:px-6 sm:py-6">
            <form id={formId} onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              {isDeactivated ? (
                <div className="flex items-center gap-3 rounded-2xl bg-[#FBE1E1] px-4 py-4 text-[#69140E]">
                  <TriangleAlert className="size-5 shrink-0" />
                  <span className="font-medium">Role Deactivated</span>
                </div>
              ) : null}

              <FormField control={control} name="role" label="Role" required>
                {({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Enter text here" disabled={isDeactivated} />
                  </FormControl>
                )}
              </FormField>

              <div className="space-y-4">
                <p className="text-sm font-medium text-text-grey">
                  Assign Permissions <span className="text-red-500">*</span>
                </p>

                <div className="space-y-4">
                  {isPermissionsLoading ? <PermissionRowsSkeleton /> : null}

                  {!isPermissionsLoading && permissionGroups.length === 0 ? (
                    <p className="text-sm text-text-grey">No permissions found.</p>
                  ) : null}

                  {!isPermissionsLoading ? (
                    <PermissionRows
                      disabled={isDeactivated}
                      permissionGroups={permissionGroups}
                      permissions={permissions}
                      setValue={setValue}
                    />
                  ) : null}
                </div>

                {permissionsError ? (
                  <p className="text-sm text-text-red">{permissionsError}</p>
                ) : null}
              </div>
            </form>
          </ModalShell.Body>

          <ModalShell.Footer stackOnMobile={false} className="justify-center pt-4">
            <ModalShell.Action
              type="button"
              variant="grey-stroke"
              className={`flex-1 ${
                mode === "edit" && !isDeactivated ? "sm:max-w-[152px]" : "sm:max-w-[196px]"
              }`}
              onClick={() => onOpenChange(false)}
            >
              Back
            </ModalShell.Action>

            {mode === "edit" ? (
              isDeactivated ? (
                <ModalShell.Action
                  type="button"
                  variant="success"
                  className="flex-1 sm:max-w-[230px]"
                  onClick={toggleRoleStatus}
                  disabled={isStatusUpdating}
                  pending={isStatusUpdating}
                >
                  Reactivate
                </ModalShell.Action>
              ) : (
                <>
                  <ModalShell.Action
                    type="button"
                    variant="danger"
                    className="flex-1 sm:max-w-[152px]"
                    onClick={toggleRoleStatus}
                    disabled={isStatusUpdating || isSavingForm}
                    pending={isStatusUpdating}
                  >
                    Deactivate
                  </ModalShell.Action>
                  <ModalShell.Action
                    type="submit"
                    form={formId}
                    className="flex-1 sm:max-w-[152px]"
                    disabled={!isValid || isPermissionsLoading || isSubmitting || isSavingForm}
                    pending={isSavingForm}
                  >
                    {config.submitLabel}
                  </ModalShell.Action>
                </>
              )
            ) : (
              <ModalShell.Action
                type="submit"
                form={formId}
                className="flex-1 sm:max-w-[196px]"
                disabled={!isValid || isPermissionsLoading || isSubmitting || isSavingForm}
                pending={isSavingForm}
              >
                {config.submitLabel}
              </ModalShell.Action>
            )}
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={ROLE_SUCCESS_COPY[successKind].title}
          description={ROLE_SUCCESS_COPY[successKind].description}
          onClose={() => onOpenChange(false)}
        />
      ),
    },
  };

  const { contentClassName, closeOnBackdropClick, content } = stageConfig[currentStage];

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={onOpenChange}
      showCloseButton={false}
      closeOnBackdropClick={closeOnBackdropClick}
      shellClassName={contentClassName}
    >
      {content}
    </ModalShell.Root>
  );
}

export default RoleFormModal;
