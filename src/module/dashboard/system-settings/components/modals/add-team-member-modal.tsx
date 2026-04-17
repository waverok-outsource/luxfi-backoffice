"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ModalShell,
  SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
  SuccessModalContent,
} from "@/components/modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { addTeamMemberSchema, type AddTeamMemberFormValues } from "@/schema/system-settings.schema";
import useSettingsFns from "@/services/functions/settings.fns";
import { useSettingsRoles } from "@/services/queries/settings.queries";
import type {
  CreateTeamMemberPayloadType,
  UpdateTeamMemberPayloadType,
} from "@/types/settings.type";
import { toTitleCase } from "@/util/helper";

type TeamMemberFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  teamMemberId?: string;
  initialValues?: AddTeamMemberFormValues;
};

type AddTeamMemberStage = "FORM" | "SUCCESS";
type TeamMemberSuccessKind = "create" | "update";

const TEAM_MEMBER_SUCCESS_COPY: Record<
  TeamMemberSuccessKind,
  { title: string; description: string }
> = {
  create: {
    title: "New Member Added",
    description: "Invitation link has been sent to user email with login access.",
  },
  update: {
    title: "Team Member Updated",
    description: "Team member details and assigned role have been saved.",
  },
};

function buildCreateTeamMemberPayload(
  values: AddTeamMemberFormValues,
): CreateTeamMemberPayloadType {
  return {
    email: values.emailAddress.trim(),
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    role: values.role.trim(),
  };
}

function buildUpdateTeamMemberPayload(
  values: AddTeamMemberFormValues,
): UpdateTeamMemberPayloadType {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    role: values.role.trim(),
  };
}

function TeamMemberFormModal({
  open,
  onOpenChange,
  mode = "add",
  teamMemberId,
  initialValues,
}: TeamMemberFormModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddTeamMemberStage>("FORM");
  const [successKind, setSuccessKind] = React.useState<TeamMemberSuccessKind>("create");
  const formId = React.useId();

  const goToSuccess = (kind: TeamMemberSuccessKind) => {
    setSuccessKind(kind);
    setCurrentStage("SUCCESS");
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<AddTeamMemberFormValues>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      emailAddress: "",
      role: "",
      ...initialValues,
    },
    mode: "all",
  });

  const { data: rolesResponse, isLoading: isRolesLoading } = useSettingsRoles();
  const roleOptions = rolesResponse?.data ?? [];
  const { createTeamMember, updateTeamMemberDetails, loading } = useSettingsFns();
  const isSavingForm = loading.CREATE_TEAM_MEMBER || loading.UPDATE_TEAM_MEMBER_DETAILS;
  const isEditModeMissingId = mode === "edit" && !teamMemberId;

  const config =
    mode === "edit"
      ? {
          title: "Edit Team Member",
          description: "Fill details to edit team member access to back-office",
          submitLabel: "Save & Update",
        }
      : {
          title: "Add New Team Member",
          description: "Fill details to add new team member access to back-office",
          submitLabel: "Send Invite",
        };

  const handleFormSubmit = async (values: AddTeamMemberFormValues) => {
    if (mode === "add") {
      const payload = buildCreateTeamMemberPayload(values);
      await createTeamMember(payload, () => goToSuccess("create"));
      return;
    }

    if (mode === "edit" && teamMemberId) {
      const payload = buildUpdateTeamMemberPayload(values);
      await updateTeamMemberDetails(teamMemberId, payload, () => goToSuccess("update"));
      return;
    }
  };

  const stageConfig: Record<
    AddTeamMemberStage,
    { contentClassName: string; closeOnBackdropClick: boolean; content: React.ReactNode }
  > = {
    FORM: {
      closeOnBackdropClick: false,
      contentClassName: "max-w-[560px] p-4",
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
              <FormField control={control} name="firstName" label="First Name" required>
                {({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Enter text here" />
                  </FormControl>
                )}
              </FormField>

              <FormField control={control} name="lastName" label="Last Name" required>
                {({ field }) => (
                  <FormControl>
                    <Input {...field} placeholder="Enter text here" />
                  </FormControl>
                )}
              </FormField>

              <FormField control={control} name="emailAddress" label="Email Address" required>
                {({ field }) => (
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter text here"
                      disabled={mode === "edit"}
                      className="disabled:bg-primary-grey-stroke disabled:text-text-black disabled:opacity-100"
                    />
                  </FormControl>
                )}
              </FormField>

              <FormField control={control} name="role" label="Role" required>
                {({ field }) => (
                  <div className="space-y-2">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isRolesLoading || roleOptions.length === 0}
                    >
                      <FormSelectTrigger>
                        <SelectValue
                          placeholder={isRolesLoading ? "Loading roles..." : "Select Role"}
                        >
                          {(selectedRoleId: string | null) => {
                            if (!selectedRoleId) return null;
                            const selected = roleOptions.find((r) => r.roleId === selectedRoleId);
                            return selected ? toTitleCase(selected.title) : selectedRoleId;
                          }}
                        </SelectValue>
                      </FormSelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.roleId} value={role.roleId}>
                            {toTitleCase(role.title)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {!isRolesLoading && roleOptions.length === 0 ? (
                      <p className="text-sm text-text-grey">No roles available.</p>
                    ) : null}
                  </div>
                )}
              </FormField>
            </form>
          </ModalShell.Body>

          <ModalShell.Footer stackOnMobile={false} className="justify-center pt-4">
            <ModalShell.Action
              type="button"
              variant="grey-stroke"
              className="flex-1 sm:max-w-[196px]"
              onClick={() => onOpenChange(false)}
            >
              Back
            </ModalShell.Action>

            <ModalShell.Action
              type="submit"
              form={formId}
              className="flex-1 sm:max-w-[196px]"
              disabled={
                !isValid || isRolesLoading || isSubmitting || isSavingForm || isEditModeMissingId
              }
              pending={isSavingForm}
            >
              {config.submitLabel}
            </ModalShell.Action>
          </ModalShell.Footer>
        </div>
      ),
    },
    SUCCESS: {
      closeOnBackdropClick: true,
      contentClassName: SUCCESS_MODAL_DEFAULT_CONTENT_CLASSNAME,
      content: (
        <SuccessModalContent
          title={TEAM_MEMBER_SUCCESS_COPY[successKind].title}
          description={TEAM_MEMBER_SUCCESS_COPY[successKind].description}
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

export default TeamMemberFormModal;
