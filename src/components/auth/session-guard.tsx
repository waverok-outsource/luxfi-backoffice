"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Storage from "@/util/storage";
import route from "@/util/route";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!Storage.getToken()) {
      Storage.clearAuth();
      router.replace(route.auth.login);
      return;
    }

    setChecked(true);
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (Storage.getToken()) {
      router.replace(route.dashboard.home);
      return;
    }

    setChecked(true);
  }, [router]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
