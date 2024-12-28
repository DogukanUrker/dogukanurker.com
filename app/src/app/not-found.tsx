"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function NotFoundPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}

export default NotFoundPage;
