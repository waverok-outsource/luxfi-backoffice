import { z } from "zod";

import { FX_CURRENCIES, FX_NOTE_MAX_LENGTH, FX_RATE_PATTERN, FX_RATE_PURPOSES } from "@/types/fx-rate.type";

export const setFxRateFormSchema = z
  .object({
    base: z.enum(FX_CURRENCIES, { message: "Choose a base currency." }),
    quote: z.enum(FX_CURRENCIES, { message: "Choose a quote currency." }),
    purpose: z.enum(FX_RATE_PURPOSES, { message: "Choose a purpose." }),
    rate: z
      .string()
      .trim()
      .min(1, "Enter a rate.")
      .regex(FX_RATE_PATTERN, "Use digits with up to 12 before and 10 after the decimal point, e.g. 1550.25.")
      .refine((value) => /[1-9]/.test(value), "The rate must be greater than zero."),
    note: z.string().max(FX_NOTE_MAX_LENGTH, `Use ${FX_NOTE_MAX_LENGTH} characters or fewer.`),
  })
  .refine((values) => values.base !== values.quote, {
    message: "Base and quote must be different currencies.",
    path: ["quote"],
  });

export type SetFxRateFormValues = z.infer<typeof setFxRateFormSchema>;
