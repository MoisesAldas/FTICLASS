"use client"

import * as React from "react"
import {
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Command,
  Download,
  Dumbbell,
  Clock,
  LayoutGrid,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  Award,
  Flame,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@workspace/ui/components/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"

import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

type NavItem = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  url?: string
  badge?: string
  items?: NavItem[]
}

const menuGroups: { menu: NavItem[]; general: NavItem[] } = {
  menu: [
    { title: "Panel", icon: LayoutDashboard, url: "/dashboard" },
    {
      title: "Planificación",
      icon: CalendarDays,
      items: [
        { title: "Pizarra Digital", icon: Award, url: "/dashboard/pizarra" },
        { title: "Clases", icon: CalendarDays, url: "/dashboard/clases" },
        { title: "Horarios", icon: Clock, url: "/dashboard/horarios" },
        { title: "Librería WODs", icon: Flame, url: "/dashboard/wods" },
        { title: "Servicios", icon: LayoutGrid, url: "/dashboard/servicios" },
      ]
    },
    {
      title: "Administración",
      icon: Users,
      items: [
        { title: "Atletas", icon: Users, url: "/dashboard/atletas" },
        { title: "Staff", icon: Award, url: "/dashboard/staff" },
        { title: "Membresías", icon: ShieldCheck, url: "/dashboard/membresias" },
        { title: "Pagos", icon: CreditCard, url: "/dashboard/pagos" },
      ]
    }
  ],
  general: [
    { title: "Ajustes", icon: Settings, url: "/dashboard/ajustes" },
    { title: "Cerrar sesión", icon: LogOut, url: "/" },
  ],
}

function NavMenuList({
  items,
  pathname,
}: {
  items: NavItem[]
  pathname: string
}) {
  return (
    <SidebarMenu className="gap-px">
      {items.map((item) => {
        // If the item has children (Nested Sub-menu)
        if (item.items && item.items.length > 0) {
          const isActiveGroup = item.items.some(
            (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url + "/")
          )

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveGroup}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "h-9 rounded-md px-2.5 transition-[background-color,color] duration-150",
                      "outline-none focus-visible:ring-2 focus-visible:ring-[#5e5ce6]/35",
                      isActiveGroup && "text-white font-medium",
                      "text-zinc-400 hover:bg-white/4 hover:text-zinc-200"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-[17px] shrink-0 transition-colors",
                        isActiveGroup
                          ? "text-[#c2c1ff]"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-none group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden text-zinc-500" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-white/10 group-data-[collapsible=icon]:hidden mt-1 pr-0 mr-0">
                    {item.items.map((subItem) => {
                      const isActive =
                        pathname === subItem.url || pathname.startsWith(subItem.url! + "/")
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "text-[12.5px] rounded-md transition-[background-color,color] duration-150 h-8",
                              isActive
                                ? "bg-white/4 text-white font-medium"
                                : "text-zinc-400 hover:bg-white/4 hover:text-white"
                            )}
                          >
                            <Link href={subItem.url as string}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }

        // Standard Flat Item
        const active =
          pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url as string + "/"))
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={active}
              tooltip={item.title}
              className={cn(
                "h-9 rounded-md px-2.5 transition-[background-color,color] duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-[#5e5ce6]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0c]",
                "data-[active=true]:bg-zinc-800 data-[active=true]:text-white data-[active=true]:font-medium",
                "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
              )}
            >
              <Link
                href={item.url as string}
                aria-current={active ? "page" : undefined}
                className="flex w-full min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              >
                <item.icon
                  className={cn(
                    "size-[17px] shrink-0 transition-colors",
                    active
                      ? "text-[#c2c1ff]"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-none group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
                {item.badge ? (
                  <span
                    className={cn(
                      "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums group-data-[collapsible=icon]:hidden",
                      active
                        ? "bg-[#5e5ce6]/25 text-white"
                        : "bg-[#5e5ce6]/15 text-[#c2c1ff]"
                    )}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/5 bg-[#0a0a0c] overflow-hidden"
      {...props}
    >
      <SidebarHeader className="flex h-16 shrink-0 flex-row items-center gap-0 border-b border-white/5 p-0 px-4 py-0 group-data-[collapsible=icon]:px-2">
        <div className="flex min-h-0 w-full min-w-0 flex-row items-center justify-start gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div
            className="flex aspect-square size-8 items-center justify-center rounded-xl bg-[#5e5ce6] shadow-lg shadow-indigo-500/20"
          >
            <Dumbbell className="size-4 text-white fill-white/20" strokeWidth={2.5} />
          </div>
          <span className="flex h-9 min-w-0 flex-1 items-center truncate font-black italic tracking-tighter text-white antialiased group-data-[collapsible=icon]:hidden">
            FITCLASS
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0 overflow-x-hidden px-3 py-4 group-data-[collapsible=icon]:px-2 scrollbar-none">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-2.5 text-[11px] font-semibold tracking-wider text-zinc-500">
            Menú
          </SidebarGroupLabel>
          <NavMenuList items={menuGroups.menu} pathname={pathname} />
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-white/5 group-data-[collapsible=icon]:my-3" />

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-2 px-2.5 text-[11px] font-semibold tracking-wider text-zinc-500">
            General
          </SidebarGroupLabel>
          <NavMenuList items={menuGroups.general} pathname={pathname} />
        </SidebarGroup>

        <div className="mt-auto border-t border-white/5 pt-4 group-data-[collapsible=icon]:hidden">
          <p className="px-2.5 text-[11px] font-semibold tracking-wider text-zinc-500">
            App móvil
          </p>
          <p className="mt-1 px-2.5 text-[12px] leading-snug text-zinc-500">
            Clases, reservas y métricas en el móvil.
          </p>
          <Button
            type="button"
            className="mt-3 w-full rounded-xl py-2 text-[12px] font-bold bg-[#5e5ce6] text-white ring-1 ring-white/10 hover:bg-[#4d4ad5] transition-colors"
          >
            <Download className="mr-2 size-3.5" />
            Descargar app
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
