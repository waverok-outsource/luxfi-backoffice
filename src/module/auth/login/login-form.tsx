"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormControl } from "@/components/util/form-controller";
import { AuthFormLayout } from "@/module/auth/shared/auth-form-layout";
import { loginSchema, LoginType } from "@/schema/auth.schema";
import useAuthFns from "@/services/functions/auth.fns";
import { zodResolver } from "@hookform/resolvers/zod";
import route from "@/util/route";

export default function LoginForm() {
  const { login, loading } = useAuthFns();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@pawnshopbyblu.com", password: "motihaha$yeAG@baby" },
    mode: "all",
  });

  const onSubmit = async (data: LoginType) => login(data);

  return (
    <AuthFormLayout title="Log in" description="Log in details to access CRM back-office portal">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="email" label="Email address" required>
          {({ field }) => (
            <FormControl>
              <Input {...field} type="email" placeholder="Enter email address here" />
            </FormControl>
          )}
        </FormField>
        <FormField control={control} name="password" label="Password" required>
          {({ field }) => (
            <div className="relative">
              <FormControl>
                <Input {...field} type="password" placeholder="Enter password here" />
              </FormControl>
            </div>
          )}
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || loading.LOGIN}
          pending={loading.LOGIN}
        >
          Log in
        </Button>

        <Link
          href={route.auth.reset}
          className="text-base font-medium underline underline-offset-2"
        >
          Forgot Password?
        </Link>
      </form>
    </AuthFormLayout>
  );
}
