import Link from "next/link";
import { Box, ChevronRight, Clock, Lock, Plus, Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { itemTypeColors, itemTypeIcons } from "@/lib/item-type-meta";
import { collections, currentUser, itemTypes } from "@/lib/mock-data";

// How many collections to surface under "Recent".
const RECENT_LIMIT = 5;

/**
 * Dashboard sidebar (phase 2). Collapses off-canvas on desktop via the top-bar
 * trigger and renders as a Sheet drawer on mobile — both handled by the ShadCN
 * Sidebar primitives. Data comes straight from mock-data until the DB lands.
 */
export function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  // mock-data is already ordered most-recent-first, so a slice is "recent".
  const recentCollections = collections.slice(0, RECENT_LIMIT);

  return (
    <Sidebar>
      <SidebarHeader className="gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-1 pt-1 font-semibold"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Box className="size-5" />
          </span>
          <span className="text-base">CodeKeep</span>
        </Link>
        <Button asChild size="lg" className="justify-start">
          <Link href="/items/new">
            <Plus />
            New item
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        {/* Library — the fixed system item types */}
        <SidebarGroup>
          <SidebarGroupLabel>Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = itemTypeIcons[type.slug];
                return (
                  <SidebarMenuItem key={type.slug}>
                    <SidebarMenuButton asChild>
                      <Link href={`/items/${type.plural.toLowerCase()}`}>
                        <Icon style={{ color: type.color }} />
                        <span>{type.plural}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      {type.isPro ? (
                        <Lock className="size-3 text-muted-foreground" />
                      ) : (
                        type.count
                      )}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorite collections */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupAction title="New collection">
            <Plus />
            <span className="sr-only">New collection</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCollections.map((collection) => {
                const Icon = itemTypeIcons[collection.dominantType];
                return (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/collections/${collection.id}`}>
                        <Icon
                          style={{ color: itemTypeColors[collection.dominantType] }}
                        />
                        <span>{collection.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Most recent collections */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Clock className="size-3.5" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentCollections.map((collection) => {
                const Icon = itemTypeIcons[collection.dominantType];
                return (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/collections/${collection.id}`}>
                        <Icon
                          style={{ color: itemTypeColors[collection.dominantType] }}
                        />
                        <span>{collection.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg text-xs">
                  {currentUser.initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
              {currentUser.isPro && (
                <span className="rounded bg-sidebar-primary px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary-foreground">
                  PRO
                </span>
              )}
              <ChevronRight className="size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
