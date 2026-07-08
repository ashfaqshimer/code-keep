import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Dashboard top bar. The sidebar trigger toggles the sidebar (off-canvas on
 * desktop, drawer on mobile). The search field and "New item" button are
 * display-only until wired up in a later phase.
 */
export function TopBar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search everything…"
          className="h-9 pl-9"
          aria-label="Search"
        />
      </div>
      <Button size="lg" className="ml-auto">
        <Plus />
        New item
      </Button>
    </header>
  );
}
