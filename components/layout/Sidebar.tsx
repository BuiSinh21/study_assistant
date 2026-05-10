"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  LayoutDashboard,
  Files,
  Lightbulb,
  Settings,
  LogOut,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { logout } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Documents",
    icon: Files,
    href: "/dashboard/documents",
    color: "text-violet-500",
  },
  {
    label: "Quizzes",
    icon: Lightbulb,
    href: "/dashboard/quizzes",
    color: "text-orange-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 space-x-2">
          <BrainCircuit className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold">Study AI</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t space-y-2">
        {session?.user && (
          <div className="flex items-center px-3 py-4 mb-2 gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                {session.user.name?.[0] || session.user.email?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{session.user.name}</span>
              <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
        >
          <div className="flex items-center flex-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </button>
      </div>
    </div>
  );
}
