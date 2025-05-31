"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const StoreRefreshButton = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <Button
      onClick={handleRefresh}
      variant="secondary"
      className="flex items-center gap-2"
    >
      <span>🔄</span>
      <span>Refresh</span>
    </Button>
  );
};
