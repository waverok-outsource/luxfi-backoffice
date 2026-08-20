"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField, FormControl } from "@/components/util/form-controller";
import { AuthFormLayout } from "@/module/auth/shared/auth-form-layout";
import { PinInput } from "@/module/auth/shared/pin-input";
import ResetSession from "@/module/auth/shared/reset-session";
import { verifyResetPinSchema, VerifyResetPinType } from "@/schema/auth.schema";
import useAuthFns from "@/services/functions/auth.fns";
import { zodResolver } from "@hookform/resolvers/zod";
import route from "@/util/route";

export default function VerifyResetPinForm() {
  const router = useRouter();
  const { verifyResetPin, forgotPassword, loading } = useAuthFns();
  const [email, setEmail] = useState("");
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<VerifyResetPinType>({
    resolver: zodResolver(verifyResetPinSchema),
    defaultValues: { pin: "" },
    mode: "all",
  });

  useEffect(() => {
    const storedEmail = ResetSession.getEmail();

    if (!storedEmail) {
      router.replace(route.auth.forgotPassword);
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  const onSubmit = async (data: VerifyResetPinType) => {
    await verifyResetPin(data, () => {
      router.push(route.auth.reset);
    });
  };

  const onResend = async () => {
    if (!email) {
      return;
    }

    await forgotPassword({ email });
  };

  if (!email) {
    return null;
  }

  return (
    <AuthFormLayout
      title="Enter Reset PIN"
      description={`A 6-digit PIN was sent to ${email}`}
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="pin" label="6-digit PIN" required>
          {({ field }) => (
            <FormControl>
              <PinInput value={field.value} onChange={field.onChange} disabled={loading.VERIFY_RESET_PIN} />
            </FormControl>
          )}
        </FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || loading.VERIFY_RESET_PIN}
          pending={loading.VERIFY_RESET_PIN}
        >
          Verify PIN
        </Button>

        <button
          type="button"
          onClick={() => void onResend()}
          disabled={loading.FORGOT_PASSWORD}
          className="text-base font-medium underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading.FORGOT_PASSWORD ? "Sending PIN..." : "Resend PIN"}
        </button>

        <Link
          href={route.auth.forgotPassword}
          className="block text-base font-medium underline underline-offset-2"
        >
          Use a different email
        </Link>
      </form>
    </AuthFormLayout>
  );
}
