import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard · CodeKeep",
};

export default function DashboardPage() {
  return (
    <div className="flex h-full items-center justify-center">
      {/* Main area placeholder — built out in phase 3 */}
      <h2 className="text-lg font-semibold text-muted-foreground">Main</h2>
    </div>
  );
}
