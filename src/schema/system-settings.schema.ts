import { z } from "zod";

const requiredText = z.string().trim().min(1, "Required");

export const addTeamMemberSchema = z.object({
  firstName: requiredText,
  lastName: requiredText,
  emailAddress: requiredText.pipe(z.email("Enter a valid email address")),
  role: requiredText,
});

export type AddTeamMemberFormValues = z.infer<typeof addTeamMemberSchema>;

const rolePermissionSelectionSchema = z.object({
  viewerOnly: z.boolean(),
  initiatorApprover: z.boolean(),
});

export const addRoleSchema = z
  .object({
    role: requiredText,
    permissions: z.record(z.string(), rolePermissionSelectionSchema),
  })
  .refine(
    (values) =>
      Object.values(values.permissions).some(
        (permission) => permission.viewerOnly || permission.initiatorApprover,
      ),
    {
      message: "Assign at least one permission.",
      path: ["permissions"],
    },
  );

export type AddRoleFormValues = z.infer<typeof addRoleSchema>;
