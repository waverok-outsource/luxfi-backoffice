import ResetForm from "@/module/auth/reset-account/reset-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

const Page = () => {
  return <ResetForm />;
};

export default Page;
