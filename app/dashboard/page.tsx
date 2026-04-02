"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  BookOpen, Brain, Trophy, PlayCircle,
  FileText, Plus, ArrowRight, Sparkles, Clock, TrendingUp
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const { user, lectures, fetchLectures, getUserQuizAttempts } = useAppStore()

  useEffect(() => { fetchLectures() }, [fetchLectures])

  if (!user) return null

  const attempts        = getUserQuizAttempts()
  const completed       = lectures.filter((l: any) => l.status === "completed")
  const avgScore        = user.scores?.length > 0
    ? Math.round(user.scores.reduce((a: number, b: number) => a + b, 0) / user.scores.length)
    : 0
  const recent          = [...lectures]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const lastAttempt     = attempts.at(-1)
  const hour            = new Date().getHours()
  const greeting        = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-1">{greeting}</p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {user.name?.split(" ")[0]}
          </h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            {completed.length > 0
              ? `${completed.length} lecture${completed.length > 1 ? "s" : ""} completed · keep going`
              : "Upload your first lecture to get started."}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/90 text-[13px] h-8 px-4 rounded-lg shadow-warm shrink-0"
          onClick={() => router.push("/dashboard/lectures")}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Lecture
        </Button>
      </div>

      {/* ── 3 stat tiles ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Lectures", value: lectures.length, sub: `${completed.length} done`, icon: BookOpen, href: "/dashboard/lectures" },
          { label: "Avg Score", value: `${avgScore}%`,  sub: `${user.scores?.length || 0} quizzes`, icon: Trophy,   href: "/dashboard/scores" },
          { label: "Attempts",  value: attempts.length, sub: "total taken",              icon: Brain,   href: "/dashboard/analytics" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => router.push(s.href)}
            className="group text-left p-4 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-md hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <ArrowRight className="h-3 w-3 text-transparent group-hover:text-muted-foreground transition-colors" />
            </div>
            <p className="text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.sub}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mt-1.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* ── AI Insight strip (only if data) ── */}
      {lastAttempt && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/8 border border-primary/20">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-foreground">
              Last quiz score:{" "}
              <span className={lastAttempt.score >= 70 ? "text-primary font-semibold" : "text-red-500 font-semibold"}>
                {lastAttempt.score}%
              </span>
            </p>
            <p className="text-[12px] text-muted-foreground">
              {lastAttempt.score >= 70
                ? "Great result — check analytics to see where you rank."
                : "Review the lecture summary and retry to improve."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-[12px] h-8 border-primary/30 text-primary hover:bg-primary/10 shrink-0"
            onClick={() => router.push("/dashboard/analytics")}
          >
            Analytics <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* ── Content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Lectures — Skilljar-style cards */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-foreground">Recent Lectures</h2>
            <button
              onClick={() => router.push("/dashboard/lectures")}
              className="text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {recent.length > 0 ? (
            <div className="space-y-2">
              {recent.map((lec: any) => {
                const statusColor =
                  lec.status === "completed"   ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                  lec.status === "processing"  ? "text-amber-600 bg-amber-50 border-amber-100" :
                  lec.status === "queued"      ? "text-amber-600 bg-amber-50 border-amber-100" :
                                                 "text-muted-foreground bg-muted border-border"

                return (
                  <div
                    key={lec._id}
                    className="group flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border shadow-warm hover:shadow-warm-md hover:border-primary/25 cursor-pointer transition-all duration-150"
                    onClick={() => router.push(`/dashboard/lectures/${lec._id}`)}
                  >
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <PlayCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-foreground truncate">{lec.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(lec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${statusColor}`}>
                        {lec.status}
                      </span>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1"
                        onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/summaries?lecture=${lec._id}`) }}
                      >
                        <FileText className="h-3 w-3" /> Summary
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl bg-card border border-dashed border-border gap-3">
              <BookOpen className="h-10 w-10 text-muted-foreground/25" />
              <p className="text-[14px] text-muted-foreground">No lectures uploaded yet</p>
              <Button
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 text-[12px] h-8 px-4 rounded-lg"
                onClick={() => router.push("/dashboard/lectures")}
              >
                <Plus className="mr-1.5 h-3 w-3" />
                Upload first lecture
              </Button>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-semibold text-foreground">Quiz Activity</h2>
            <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
          </div>

          <div className="rounded-xl bg-card border border-border shadow-warm overflow-hidden">
            {attempts.length > 0 ? (
              <div className="divide-y divide-border">
                {attempts.slice(-6).reverse().map((a: any, i: number) => (
                  <div key={a.id || i} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-secondary flex items-center justify-center">
                        <Brain className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">Quiz completed</p>
                        <p className="text-[11px] text-muted-foreground">
                          {a.completedAt
                            ? new Date(a.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full border ${
                      a.score >= 70
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                        : "text-red-600 bg-red-50 border-red-100"
                    }`}>
                      {a.score}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground/20" />
                <p className="text-[12px] text-muted-foreground text-center">
                  Complete a quiz to see your activity
                </p>
              </div>
            )}
          </div>

          {attempts.length > 0 && (
            <button
              className="w-full text-[12px] text-muted-foreground hover:text-primary transition-colors text-center py-1"
              onClick={() => router.push("/dashboard/analytics")}
            >
              View full analytics →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
