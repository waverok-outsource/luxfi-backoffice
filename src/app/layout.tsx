import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "sonner";

import QueryClientProviderWrapper from "@/components/providers/query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const pageTitle = "LuxFi Backoffice";

export const metadata: Metadata = {
  title: {
    template: `%s | ${pageTitle}`,
    default: pageTitle,
  },
  creator: "Waverok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} font-urbanist text-primary-black`}>
        <QueryClientProviderWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster position="top-right" richColors duration={5000} closeButton visibleToasts={1} />
          {children}
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
