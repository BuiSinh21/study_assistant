"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            <span className="font-bold inline-block">AI Study Assistant</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
              Login
            </Link>
            <Link href="/register" className={buttonVariants({ className: "bg-indigo-600 hover:bg-indigo-700 text-white" })}>
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
