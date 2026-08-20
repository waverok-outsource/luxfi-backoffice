import ForgotPasswordForm from "@/module/auth/reset-account/forgot-password-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

const Page = () => {
  return <ForgotPasswordForm />;
};

export default Page;
