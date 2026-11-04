"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useWatch, type Control, type FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormField, FormSelectTrigger, FormSwitchField, FormTextarea } from "@/components/util/form-controller";
import {
  blankRequirement,
  captureTypeLabel,
  documentSideLabel,
  inputTypeLabel,
  isLengthFieldType,
  isOptionFieldType,
} from "@/module/dashboard/kyc/form";
import type { KycTierFormValues } from "@/schema/kyc.schema";
import {
  KYC_CAPTURE_TYPES,
  KYC_DOCUMENT_SIDES,
  KYC_FIELD_TYPES,
  KYC_INPUT_TYPES,
  type KycFieldType,
} from "@/types/kyc.type";

type RequirementEditorProps = {
  control: Control<KycTierFormValues>;
  errors: FieldErrors<KycTierFormValues>;
};

export function RequirementEditor({ control, errors }: RequirementEditorProps) {
  const requirements = useFieldArray({ control, name: "requirements" });

  return (
    <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text-black">Requirements</h2>
          <p className="mt-1 text-sm text-text-grey">
            Each requirement is one thing the customer must submit for this tier.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => requirements.append(blankRequirement())}
        >
          <Plus className="h-4 w-4" />
          Add requirement
        </Button>
      </div>

      <div className="space-y-4">
        {requirements.fields.map((requirement, index) => (
          <RequirementCard
            key={requirement.id}
            control={control}
            index={index}
            errors={errors}
            canMoveUp={index > 0}
            canMoveDown={index < requirements.fields.length - 1}
            canRemove={requirements.fields.length > 1}
            onMoveUp={() => requirements.move(index, index - 1)}
            onMoveDown={() => requirements.move(index, index + 1)}
            onRemove={() => requirements.remove(index)}
          />
        ))}
      </div>
    </section>
  );
}

type RequirementCardProps = {
  control: Control<KycTierFormValues>;
  index: number;
  errors: FieldErrors<KycTierFormValues>;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canRemove: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function RequirementCard({
  control,
  index,
  errors,
  canMoveUp,
  canMoveDown,
  canRemove,
  onMoveUp,
  onMoveDown,
  onRemove,
}: RequirementCardProps) {
  const inputType = useWatch({ control, name: `requirements.${index}.inputType` });
  const fieldType = useWatch({ control, name: `requirements.${index}.fieldType` });
  const fronSide = useWatch({ control, name: `requirements.${index}.fronSide` });
  const options = useFieldArray({ control, name: `requirements.${index}.options` });
  const optionsError = messageOf(errors.requirements?.[index]?.options);

  return (
    <article className="space-y-4 rounded-2xl border border-primary-grey-stroke bg-primary-grey-undertone/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-black">Requirement {index + 1}</h3>
        <div className="flex items-center gap-1">
          <IconButton label="Move requirement up" disabled={!canMoveUp} onClick={onMoveUp}>
            <ChevronUp className="h-4 w-4" />
          </IconButton>
          <IconButton label="Move requirement down" disabled={!canMoveDown} onClick={onMoveDown}>
            <ChevronDown className="h-4 w-4" />
          </IconButton>
          <IconButton label="Remove requirement" disabled={!canRemove} onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField control={control} name={`requirements.${index}.name`} label="Name" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Government ID" />
            </FormControl>
          )}
        </FormField>
        <FormField
          control={control}
          name={`requirements.${index}.inputType`}
          label="Input type"
          required
        >
          {({ field }) => (
            <EnumSelect
              value={field.value}
              onChange={(value) => field.onChange(value)}
              options={KYC_INPUT_TYPES.map((value) => ({ value, label: inputTypeLabel(value) }))}
            />
          )}
        </FormField>
      </div>

      <FormField control={control} name={`requirements.${index}.description`} label="Description">
        {({ field }) => (
          <FormTextarea {...field} placeholder="Tell the customer what to provide" />
        )}
      </FormField>

      <div className="grid gap-3 md:grid-cols-2">
        <FormSwitchField
          control={control}
          name={`requirements.${index}.required`}
          label="Required"
          description="Customers must complete this before the tier can be approved."
        />
        <FormSwitchField
          control={control}
          name={`requirements.${index}.isSensitive`}
          label="Sensitive"
          description="Submitted values stay hidden until a reviewer confirms their password."
        />
      </div>

      {inputType === "form" ? (
        <FormRequirementFields
          control={control}
          index={index}
          fieldType={fieldType}
          options={options}
          optionsError={optionsError}
        />
      ) : null}

      {inputType === "document" ? (
        <div className="grid gap-4 rounded-2xl bg-primary-white p-4 md:grid-cols-2">
          <FormField
            control={control}
            name={`requirements.${index}.acceptedMimeTypes`}
            label="Accepted file types"
            description="Comma-separated MIME types."
            required
            className="md:col-span-2"
          >
            {({ field }) => (
              <FormControl>
                <Input {...field} placeholder="image/jpeg, image/png, application/pdf" />
              </FormControl>
            )}
          </FormField>
          <FormField control={control} name={`requirements.${index}.fronSide`} label="Front side" required>
            {({ field }) => (
              <EnumSelect
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={KYC_DOCUMENT_SIDES.map((value) => ({
                  value,
                  label: documentSideLabel(value),
                }))}
              />
            )}
          </FormField>
          {fronSide === "front_back" ? (
            <FormField control={control} name={`requirements.${index}.backSide`} label="Back side" required>
              {({ field }) => (
                <EnumSelect
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={KYC_DOCUMENT_SIDES.map((value) => ({
                    value,
                    label: documentSideLabel(value),
                  }))}
                />
              )}
            </FormField>
          ) : null}
        </div>
      ) : null}

      {inputType === "camera" || inputType === "liveness" ? (
        <div className="rounded-2xl bg-primary-white p-4">
          <FormField
            control={control}
            name={`requirements.${index}.captureType`}
            label="Capture type"
            required
          >
            {({ field }) => (
              <EnumSelect
                value={field.value}
                onChange={(value) => field.onChange(value)}
                options={(inputType === "liveness"
                  ? KYC_CAPTURE_TYPES.filter((value) => value !== "document")
                  : KYC_CAPTURE_TYPES
                ).map((value) => ({ value, label: captureTypeLabel(value) }))}
              />
            )}
          </FormField>
        </div>
      ) : null}
    </article>
  );
}

function FormRequirementFields({
  control,
  index,
  fieldType,
  options,
  optionsError,
}: {
  control: Control<KycTierFormValues>;
  index: number;
  fieldType: KycFieldType;
  options: ReturnType<typeof useFieldArray<KycTierFormValues, `requirements.${number}.options`>>;
  optionsError: string | null;
}) {
  return (
    <div className="space-y-4 rounded-2xl bg-primary-white p-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`requirements.${index}.fieldName`}
          label="Field name"
          description="Used as the stored key. Example: bvn or governmentId."
          required
        >
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="bvn" />
            </FormControl>
          )}
        </FormField>
        <FormField control={control} name={`requirements.${index}.fieldType`} label="Field type" required>
          {({ field }) => (
            <EnumSelect
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                if (isOptionFieldType(value) && options.fields.length === 0) {
                  options.append({ label: "", value: "" });
                }
              }}
              options={KYC_FIELD_TYPES.map((value) => ({
                value,
                label: FIELD_TYPE_LABELS[value],
              }))}
            />
          )}
        </FormField>
        <FormField control={control} name={`requirements.${index}.fieldLabel`} label="Label">
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="BVN" />
            </FormControl>
          )}
        </FormField>
        <FormField control={control} name={`requirements.${index}.placeholder`} label="Placeholder">
          {({ field }) => (
            <FormControl>
              <Input {...field} placeholder="Enter 11-digit BVN number" />
            </FormControl>
          )}
        </FormField>
      </div>

      <FormField control={control} name={`requirements.${index}.helperText`} label="Helper text">
        {({ field }) => <FormTextarea {...field} placeholder="Optional guidance shown to the customer" />}
      </FormField>

      <FormSwitchField
        control={control}
        name={`requirements.${index}.fieldRequired`}
        label="Field is required"
      />

      {fieldType === "number" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <NumberField control={control} name={`requirements.${index}.min`} label="Minimum" />
          <NumberField control={control} name={`requirements.${index}.max`} label="Maximum" />
        </div>
      ) : null}

      {isLengthFieldType(fieldType) ? (
        <div className="grid gap-4 md:grid-cols-2">
          <NumberField control={control} name={`requirements.${index}.minLength`} label="Minimum length" />
          <NumberField control={control} name={`requirements.${index}.maxLength`} label="Maximum length" />
        </div>
      ) : null}

      {isOptionFieldType(fieldType) ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-text-black">Options</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => options.append({ label: "", value: "" })}
            >
              <Plus className="h-4 w-4" />
              Add option
            </Button>
          </div>
          {optionsError ? <p className="text-sm text-text-red">{optionsError}</p> : null}
          <div className="space-y-3">
            {options.fields.map((option, optionIndex) => (
              <div key={option.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <FormField
                  control={control}
                  name={`requirements.${index}.options.${optionIndex}.label`}
                  label="Label"
                >
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="NIN" />
                    </FormControl>
                  )}
                </FormField>
                <FormField
                  control={control}
                  name={`requirements.${index}.options.${optionIndex}.value`}
                  label="Value"
                >
                  {({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="nin" />
                    </FormControl>
                  )}
                </FormField>
                <div className="flex items-end pb-1">
                  <IconButton
                    label="Remove option"
                    disabled={options.fields.length === 1}
                    onClick={() => options.remove(optionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NumberField({
  control,
  name,
  label,
}: {
  control: Control<KycTierFormValues>;
  name:
    | `requirements.${number}.min`
    | `requirements.${number}.max`
    | `requirements.${number}.minLength`
    | `requirements.${number}.maxLength`;
  label: string;
}) {
  return (
    <FormField control={control} name={name} label={label}>
      {({ field }) => (
        <FormControl>
          <Input {...field} inputMode="decimal" placeholder="Optional" />
        </FormControl>
      )}
    </FormField>
  );
}

function EnumSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (typeof next === "string") onChange(next as T);
      }}
    >
      <FormSelectTrigger>
        <SelectValue>
          {(selected: string | null) =>
            options.find((option) => option.value === selected)?.label ?? "Select"
          }
        </SelectValue>
      </FormSelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-xl"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function messageOf(error: unknown) {
  if (!error || typeof error !== "object") return null;
  if ("message" in error && typeof error.message === "string") return error.message;
  return null;
}

const FIELD_TYPE_LABELS: Record<KycFieldType, string> = {
  string: "Text",
  textarea: "Long text",
  number: "Number",
  boolean: "Yes / No",
  date: "Date",
  datetime: "Date and time",
  email: "Email",
  phone: "Phone",
  select: "Dropdown",
  radio: "Radio",
  checkbox: "Checkbox",
  file: "File",
};
