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
import { teamRoleOptions } from "@/module/dashboard/system-settings/data";
import { addTeamMemberSchema, type AddTeamMemberFormValues } from "@/schema/system-settings.schema";

type TeamMemberFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  initialValues?: AddTeamMemberFormValues;
  onSubmit: (values: AddTeamMemberFormValues) => void;
};

type AddTeamMemberStage = "FORM" | "SUCCESS";

const DEFAULT_VALUES: AddTeamMemberFormValues = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  role: "",
};

function TeamMemberFormModal({
  open,
  onOpenChange,
  mode = "add",
  initialValues,
  onSubmit,
}: TeamMemberFormModalProps) {
  const [currentStage, setCurrentStage] = React.useState<AddTeamMemberStage>("FORM");
  const formId = React.useId();
  const resolvedValues = {
    ...DEFAULT_VALUES,
    ...initialValues,
  };

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AddTeamMemberFormValues>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: resolvedValues,
    mode: "all",
  });

  const config =
    mode === "edit"
      ? {
          title: "Edit Team Member",
          description: "Fill details to edit team member access to back-office",
          submitLabel: "Save & Update",
          successTitle: "",
          successDescription: "",
        }
      : {
          title: "Add New Team Member",
          description: "Fill details to add new team member access to back-office",
          submitLabel: "Send Invite",
          successTitle: "New Member Added",
          successDescription: "Invitation link has been sent to user email with login access.",
        };

  const handleFormSubmit = (values: AddTeamMemberFormValues) => {
    onSubmit(values);

    if (mode === "edit") {
      onOpenChange(false);
      return;
    }

    setCurrentStage("SUCCESS");
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
                      className="disabled:opacity-100 disabled:bg-primary-grey-stroke disabled:text-text-black"
                    />
                  </FormControl>
                )}
              </FormField>

              <FormField control={control} name="role" label="Role" required>
                {({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormSelectTrigger>
                      <SelectValue placeholder="Select Options" />
                    </FormSelectTrigger>
                    <SelectContent>
                      {teamRoleOptions.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              disabled={!isValid}
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
          title={config.successTitle}
          description={config.successDescription}
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

type AddTeamMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (values: AddTeamMemberFormValues) => void;
};

export function AddTeamMemberModal({ open, onOpenChange, onInvite }: AddTeamMemberModalProps) {
  return (
    <TeamMemberFormModal open={open} onOpenChange={onOpenChange} mode="add" onSubmit={onInvite} />
  );
}

type EditTeamMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AddTeamMemberFormValues;
  onSave: (values: AddTeamMemberFormValues) => void;
};

export function EditTeamMemberModal({
  open,
  onOpenChange,
  initialValues,
  onSave,
}: EditTeamMemberModalProps) {
  return (
    <TeamMemberFormModal
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialValues={initialValues}
      onSubmit={onSave}
    />
  );
}
