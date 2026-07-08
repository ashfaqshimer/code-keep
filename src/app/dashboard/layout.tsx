import { TopBar } from "@/components/dashboard/top-bar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar placeholder — built out in phase 2 */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:flex md:items-center md:justify-center">
        <h2 className="text-lg font-semibold text-muted-foreground">Sidebar</h2>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
