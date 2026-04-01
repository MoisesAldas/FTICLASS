"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { Search, Mail, Bell, Command as CommandIcon } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const isTvMode = searchParams.get("tv") === "true"

  return (
    <SidebarProvider defaultOpen={!isTvMode} key={isTvMode ? "tv" : "normal"}>
      {!isTvMode && <AppSidebar />}
      <SidebarInset className={cn("bg-[#0a0a0c]", isTvMode && "flex-1")}>
        {!isTvMode && (
          <header className="flex h-16 shrink-0 items-center justify-between px-6 md:px-8 bg-[#0a0a0c] border-b border-white/5 sticky top-0 z-50">
            <div className="flex items-center gap-4 md:gap-8 flex-1 max-w-2xl min-w-0">
              <SidebarTrigger className="text-zinc-500 hover:text-white shrink-0" />

              <div className="relative w-full max-md hidden md:block min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                <Input
                  placeholder="Buscar atletas, clases o reservas…"
                  className="w-full bg-zinc-900/60 border-white/5 rounded-2xl pl-10 pr-14 h-11 text-sm focus-visible:ring-[#5e5ce6]/35 font-medium placeholder:text-zinc-600"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-2 py-0.5 rounded-lg border border-white/10 bg-zinc-900/80 text-[10px] text-zinc-500 font-black uppercase tracking-wider">
                  <CommandIcon className="size-2.5 opacity-70" />
                  <span>F</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6 shrink-0">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white"
                >
                  <Mail className="size-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white relative"
                >
                  <Bell className="size-5" />
                  <span className="absolute top-2 right-2 size-2 bg-[#5e5ce6] rounded-full border-2 border-[#0a0a0c]" />
                </Button>
              </div>

              <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
                <div className="text-right hidden sm:block min-w-0">
                  <p className="text-sm font-bold text-white leading-tight truncate">
                    Patricia Vega
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium leading-tight truncate">
                    patricia@fitclass.app
                  </p>
                </div>
                <Avatar className="size-10 rounded-2xl border-2 border-white/5 ring-1 ring-white/5">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="font-black bg-zinc-800 text-zinc-400 text-[10px] rounded-2xl">
                    PV
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
        )}

        <main className={cn(
          "px-6 md:px-8 pt-6 pb-12 transition-all duration-300 min-h-screen",
          isTvMode && "p-0 pt-0 pb-0 flex flex-col"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  )
}
