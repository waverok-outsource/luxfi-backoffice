"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DURATION_UNIT_VALUES,
  type DurationFormValue,
  type DurationUnit,
} from "@/schema/asset-management.schema";

const DURATION_UNIT_LABELS: Record<DurationUnit, string> = {
  days: "Days",
  weeks: "Weeks",
  months: "Months",
  years: "Years",
};

type DurationFieldProps = {
  value: DurationFormValue;
  onChange: (next: DurationFormValue) => void;
};

/** A single {value, unit} duration input — a number field paired with a unit select. */
export function DurationField({ value, onChange }: DurationFieldProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="text"
        inputMode="numeric"
        value={value.value}
        onChange={(event) => {
          const digitsOnly = event.target.value.replace(/[^0-9]/g, "");
          onChange({ ...value, value: digitsOnly === "" ? 0 : parseInt(digitsOnly, 10) });
        }}
        className="flex-1"
      />
      <Select
        value={value.unit}
        onValueChange={(unit) => onChange({ ...value, unit: unit as DurationUnit })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DURATION_UNIT_VALUES.map((unit) => (
            <SelectItem key={unit} value={unit}>
              {DURATION_UNIT_LABELS[unit]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const DEFAULT_DURATION_ENTRY: DurationFormValue = { value: 1, unit: "days" };

type DurationListFieldProps = {
  value: DurationFormValue[];
  onChange: (next: DurationFormValue[]) => void;
  addLabel?: string;
};

/** A repeatable list of {value, unit} durations with add/remove controls (e.g. loan tenures). */
export function DurationListField({ value, onChange, addLabel = "Add" }: DurationListFieldProps) {
  return (
    <div className="space-y-2">
      {value.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <DurationField
            value={entry}
            onChange={(next) => onChange(value.map((item, i) => (i === index ? next : item)))}
          />
          <Button
            type="button"
            variant="grey-stroke"
            size="sm"
            className="shrink-0"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="grey-stroke"
        size="sm"
        onClick={() => onChange([...value, DEFAULT_DURATION_ENTRY])}
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}
