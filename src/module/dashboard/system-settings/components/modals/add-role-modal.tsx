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
import { Switch } from "@/components/ui/switch";
import {
  rolePermissionModules,
  type RolePermissionStatus,
} from "@/module/dashboard/system-settings/data";
import { addRoleSchema, type AddRoleFormValues } from "@/schema/system-settings.schema";

type RoleFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  status?: RolePermissionStatus;
  initialValues?: AddRoleFormValues;
  onSubmit: (values: AddRoleFormValues) => void;
  onDeactivate?: () => void;
  onReactivate?: () => void;
};

type AddRoleStage = "FORM" | "SUCCESS";

function createDefaultPermissions(): AddRoleFormValues["permissions"] {
  return Object.fromEntries(
    rolePermissionModules.map((module) => [
      module.key,
      { viewerOnly: false, initiatorApprover: false },
    ]),
  ) as AddRoleFormValues["permissions"];
}

const DEFAULT_VALUES: AddRoleFormValues = {
  role: "",
  permissions: createDefaultPermissions(),
};

function RoleFormModal({
  open,
  onOpenChange,
  mode = "add",
  status = "active",
  initialValues,
  onSubmit,
  onDeactivate,
  onReactivate,
}: RoleFormModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddRoleStage>("FORM");
  const formId = React.useId();
  const isDeactivated = status === "deactivated";

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      ...DEFAULT_VALUES,
      ...initialValues,
      permissions: {
        ...createDefaultPermissions(),
        ...initialValues?.permissions,
      },
    },
    mode: "all",
  });

  const permissions = useWatch({
    control,
    name: "permissions",
  });
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

  const handleFormSubmit = (values: AddRoleFormValues) => {
    onSubmit(values);

    if (mode === "edit") {
      onOpenChange(false);
      return;
    }

    setCurrentStage("SUCCESS");
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

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-grey">
                  Role <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("role")}
                  placeholder="Enter text here"
                  disabled={isDeactivated}
                />
                {errors.role?.message ? (
                  <p className="text-sm text-text-red">{errors.role.message}</p>
                ) : null}
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-text-grey">
                  Assign Permissions <span className="text-red-500">*</span>
                </p>

                <div className="space-y-4">
                  {rolePermissionModules.map((module) => {
                    const modulePermissions = permissions[module.key] ?? {
                      viewerOnly: false,
                      initiatorApprover: false,
                    };

                    return (
                      <div
                        key={module.key}
                        className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
                      >
                        <span className="font-medium text-text-black">{module.label}</span>

                        <label className="inline-flex items-center gap-3 text-sm text-text-grey">
                          <Switch
                            size="sm"
                            tone="success"
                            checked={modulePermissions.viewerOnly}
                            disabled={isDeactivated}
                            onCheckedChange={(checked) => {
                              setValue(`permissions.${module.key}.viewerOnly`, Boolean(checked), {
                                shouldDirty: true,
                                shouldValidate: true,
                              });

                              if (checked) {
                                setValue(`permissions.${module.key}.initiatorApprover`, false, {
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
                            checked={modulePermissions.initiatorApprover}
                            disabled={isDeactivated}
                            onCheckedChange={(checked) => {
                              setValue(
                                `permissions.${module.key}.initiatorApprover`,
                                Boolean(checked),
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              );

                              if (checked) {
                                setValue(`permissions.${module.key}.viewerOnly`, false, {
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
                  })}
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
                  onClick={onReactivate}
                >
                  Reactivate
                </ModalShell.Action>
              ) : (
                <>
                  <ModalShell.Action
                    type="button"
                    variant="danger"
                    className="flex-1 sm:max-w-[152px]"
                    onClick={onDeactivate}
                  >
                    Deactivate
                  </ModalShell.Action>
                  <ModalShell.Action
                    type="submit"
                    form={formId}
                    className="flex-1 sm:max-w-[152px]"
                    disabled={!isValid}
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
                disabled={!isValid}
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
          title="New Role Added"
          description="New role has been added with assigned permissions."
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

type AddRoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: AddRoleFormValues) => void;
};

export function AddRoleModal({ open, onOpenChange, onSave }: AddRoleModalProps) {
  return <RoleFormModal open={open} onOpenChange={onOpenChange} mode="add" onSubmit={onSave} />;
}

type EditRoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: RolePermissionStatus;
  initialValues: AddRoleFormValues;
  onSave: (values: AddRoleFormValues) => void;
  onDeactivate: () => void;
  onReactivate: () => void;
};

export function EditRoleModal({
  open,
  onOpenChange,
  status,
  initialValues,
  onSave,
  onDeactivate,
  onReactivate,
}: EditRoleModalProps) {
  return (
    <RoleFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      status={status}
      initialValues={initialValues}
      onSubmit={onSave}
      onDeactivate={onDeactivate}
      onReactivate={onReactivate}
    />
  );
}
