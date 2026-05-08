import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
        <Sidebar />
      </div>
      <main className="md:pl-72 h-full">
        {/* Top Navbar for Mobile/General */}
        <div className="flex items-center justify-between md:justify-end p-4 border-b">
          <div className="md:hidden">
            <span className="font-bold">Study AI</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* User Avatar can go here later */}
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
