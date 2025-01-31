"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Profile Overview",
    href: "/profile",
    icon: UserCircle,
  },
  {
    title: "My Orders",
    href: "/profile/orders",
    icon: ShoppingBag,
  },
  {
    title: "Settings",
    href: "/profile/settings",
    icon: Settings,
  },
  {
    title: "Sign Out",
    href: "#",
    icon: LogOut,
    className: "text-red-500 hover:text-red-600 hover:bg-red-50",
  },
];

interface ProfileSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileSidebar({ open, onOpenChange }: ProfileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden z-40 "
          onClick={() => onOpenChange?.(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-card border-r pt-16 lg:pt-0 z-40 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-24 lg:hidden"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-6">
          <h2 className="text-lg font-semibold">My Account</h2>
        </div>

        <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  isActive && "bg-accent",
                  item.className
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
