"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormControl } from "@/components/util/form-controller";
import { AuthFormLayout } from "@/module/auth/shared/auth-form-layout";
import { resetSchema, ResetSchemaType } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetForm() {
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
    defaultValues: { confirmPassword: "", password: "" },
    mode: "all",
  });

  const onSubmit = (data: ResetSchemaType) => {
    console.log(data);
  };

  return (
    <AuthFormLayout
      title="Reset Account Passsword"
      description="Log in details to access CRM back-office portal"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="password" label="New Password">
          {({ field }) => (
            <FormControl>
              <Input {...field} type="password" placeholder="Enter password here" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="confirmPassword" label="Confirm New Password ">
          {({ field }) => (
            <div className="relative">
              <FormControl>
                <Input {...field} type="password" placeholder="Enter password here" />
              </FormControl>
            </div>
          )}
        </FormField>

        <Button type="submit" className="w-full" disabled={!isDirty || !isValid}>
          Reset Password
        </Button>
      </form>
    </AuthFormLayout>
  );
}
