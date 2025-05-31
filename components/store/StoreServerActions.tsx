import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreRefreshButton } from "./StoreRefreshButton";
import Link from "next/link";

interface StoreServerActionsProps {
  isAdmin: boolean;
}

export const StoreServerActions = ({ isAdmin }: StoreServerActionsProps) => {
  return (
    <div className="flex gap-2">
      <StoreRefreshButton />

      {isAdmin && (
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link href="/store/dashboard">
            <Settings className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
