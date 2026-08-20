"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormControl } from "@/components/util/form-controller";
import { AuthFormLayout } from "@/module/auth/shared/auth-form-layout";
import ResetSession from "@/module/auth/shared/reset-session";
import { resetSchema, ResetSchemaType } from "@/schema/auth.schema";
import useAuthFns from "@/services/functions/auth.fns";
import { zodResolver } from "@hookform/resolvers/zod";
import route from "@/util/route";

export default function ResetForm() {
  const router = useRouter();
  const { setPassword, loading } = useAuthFns();
  const [ready, setReady] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(resetSchema),
    defaultValues: { confirmPassword: "", password: "" },
    mode: "all",
  });

  useEffect(() => {
    if (!ResetSession.getResetToken()) {
      router.replace(route.auth.forgotPassword);
      return;
    }

    setReady(true);
  }, [router]);

  const onSubmit = async (data: ResetSchemaType) => {
    await setPassword(data, () => {
      window.location.href = route.auth.login;
    });
  };

  if (!ready) {
    return null;
  }

  return (
    <AuthFormLayout title="Reset Password" description="Enter a new password for your account">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="password" label="New Password" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} type="password" placeholder="Enter password here" />
            </FormControl>
          )}
        </FormField>

        <FormField control={control} name="confirmPassword" label="Confirm New Password" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} type="password" placeholder="Enter password here" />
            </FormControl>
          )}
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={!isDirty || !isValid || loading.SET_PASSWORD}
          pending={loading.SET_PASSWORD}
        >
          Reset Password
        </Button>
      </form>
    </AuthFormLayout>
  );
}
