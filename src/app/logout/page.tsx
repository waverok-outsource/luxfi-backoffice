"use client";

import { useEffect, useRef } from "react";
import useAuthFns from "@/services/functions/auth.fns";

export default function LogoutPage() {
  const { logout } = useAuthFns();
  const hasLoggedOutRef = useRef(false);

  useEffect(() => {
    if (hasLoggedOutRef.current) {
      return;
    }

    hasLoggedOutRef.current = true;
    void logout();
  }, [logout]);

  return null;
}
