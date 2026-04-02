"use client"

import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen, FileText, Brain, Trophy,
  BarChart3, User, LayoutDashboard, LineChart,
} from "lucide-react"

const nav = [
  { label: "Home",      href: "/dashboard",            icon: LayoutDashboard },
  { label: "Lectures",  href: "/dashboard/lectures",   icon: BookOpen },
  { label: "Summaries", href: "/dashboard/summaries",  icon: FileText },
  { label: "Quizzes",   href: "/dashboard/quizzes",    icon: Brain },
  { label: "Scores",    href: "/dashboard/scores",     icon: Trophy },
  { label: "Progress",  href: "/dashboard/progress",   icon: BarChart3 },
  { label: "Analytics", href: "/dashboard/analytics",  icon: LineChart },
  { label: "Profile",   href: "/dashboard/profile",    icon: User },
]

export function Sidebar() {
  const router   = useRouter()
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[200px] flex-col border-r border-border bg-sidebar shrink-0">
      <ScrollArea className="flex-1 py-3">
        <nav className="px-2 space-y-0.5">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 text-left",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground/70")} />
                {item.label}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Upgrade nudge — Skilljar-style */}
      <div className="p-3 border-t border-border">
        <div className="rounded-xl bg-primary/8 border border-primary/15 p-3.5">
          <p className="text-[11px] font-semibold text-primary mb-1">Study Tip</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Review weak areas first before new lectures.
          </p>
        </div>
      </div>
    </aside>
  )
}
