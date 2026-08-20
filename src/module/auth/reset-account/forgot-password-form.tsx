"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormControl } from "@/components/util/form-controller";
import { AuthFormLayout } from "@/module/auth/shared/auth-form-layout";
import { forgotPasswordSchema, ForgotPasswordType } from "@/schema/auth.schema";
import useAuthFns from "@/services/functions/auth.fns";
import { zodResolver } from "@hookform/resolvers/zod";
import route from "@/util/route";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword, loading } = useAuthFns();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "all",
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    await forgotPassword(data, () => {
      router.push(route.auth.verifyResetPin);
    });
  };

  return (
    <AuthFormLayout
      title="Forgot Password"
      description="Enter the email associated with your back-office account"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="email" label="Email address" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} type="email" placeholder="Enter email address here" />
            </FormControl>
          )}
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || loading.FORGOT_PASSWORD}
          pending={loading.FORGOT_PASSWORD}
        >
          Send Reset PIN
        </Button>

        <Link
          href={route.auth.login}
          className="block text-base font-medium underline underline-offset-2"
        >
          Back to log in
        </Link>
      </form>
    </AuthFormLayout>
  );
}
