"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  ArrowRight, Mic, Brain, FileText,
  BarChart3, Sparkles, GraduationCap, CheckCircle,
  BookOpen, Trophy, TrendingUp, PlayCircle,
} from "lucide-react"

/* ── tiny mock UI shown in hero ── */
function ProductPreview() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-14 px-4 sm:px-6">
      <div className="rounded-2xl border border-border shadow-warm-md overflow-hidden bg-card">
        {/* fake top bar */}
        <div className="h-10 bg-secondary border-b border-border flex items-center gap-2 px-4">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-3 text-[11px] text-muted-foreground font-medium">Lecture Lens — Dashboard</span>
        </div>
        {/* fake layout */}
        <div className="flex" style={{ height: 340 }}>
          {/* fake sidebar */}
          <div className="w-44 border-r border-border bg-sidebar shrink-0 p-3 space-y-1 hidden sm:block">
            {["Home","Lectures","Summaries","Quizzes","Scores","Analytics"].map((item, i) => (
              <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 0 ? "bg-[#EAB308]/12" : ""}`}>
                <div className={`h-3 w-3 rounded ${i === 0 ? "bg-[#EAB308]" : "bg-muted-foreground/30"}`} />
                <span className={`text-[11px] ${i === 0 ? "text-[#EAB308] font-semibold" : "text-muted-foreground"}`}>{item}</span>
              </div>
            ))}
          </div>
          {/* fake content */}
          <div className="flex-1 p-5 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-3 w-20 bg-muted-foreground/20 rounded mb-1.5" />
                <div className="h-5 w-36 bg-foreground/80 rounded" />
              </div>
              <div className="h-7 w-24 bg-foreground/80 rounded-lg" />
            </div>
            {/* stat row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Lectures", val: "12", color: "bg-foreground/8" },
                { label: "Avg Score", val: "84%", color: "bg-[#EAB308]/10" },
                { label: "Attempts", val: "28", color: "bg-foreground/8" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border border-border p-3 ${s.color}`}>
                  <div className="h-3 w-3 rounded bg-muted-foreground/25 mb-2" />
                  <div className="text-[18px] font-bold text-foreground/80">{s.val}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            {/* lecture rows */}
            <div className="space-y-2">
              {[
                { t: "Machine Learning — Lecture 3", s: "completed" },
                { t: "Data Structures & Algorithms", s: "processing" },
                { t: "Operating Systems Overview",   s: "completed" },
              ].map((l) => (
                <div key={l.t} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
                      <PlayCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-[12px] font-medium text-foreground/80">{l.t}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    l.s === "completed"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                      : "text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20"
                  }`}>{l.s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAppStore()

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard")
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">Lecture Lens</span>
          </div>
          <nav className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm"
              className="text-muted-foreground hover:text-foreground text-[13px] h-8"
              onClick={() => router.push("/auth/login")}>
              Sign in
            </Button>
            <Button size="sm"
              className="bg-foreground text-background hover:bg-foreground/90 text-[13px] h-8 px-4 rounded-lg"
              onClick={() => router.push("/auth/signup")}>
              Get started →
            </Button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-14 pb-0 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20 text-[12px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            AI-powered academic platform
          </div>

          <h1 className="text-[48px] sm:text-[60px] lg:text-[72px] font-bold tracking-[-0.04em] leading-[1.04] mb-5 text-foreground">
            Turn any lecture into
            <br />
            <span className="text-primary">structured knowledge</span>
          </h1>

          <p className="text-[16px] sm:text-[18px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Upload video, audio, or slides. Get AI transcripts, concise summaries,
            and self-assessment quizzes — in under a minute.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Button size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-11 px-8 text-[14px] font-semibold rounded-xl shadow-warm-md transition-all hover:scale-[1.01]"
              onClick={() => router.push("/auth/signup")}>
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline"
              className="h-11 px-6 text-[14px] rounded-xl border-border text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/auth/login")}>
              Sign in to dashboard
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            {["Free to start", "No credit card", "AI-powered"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Product preview */}
        <ProductPreview />
      </section>

      {/* ── Steps ── */}
      <section className="pt-20 pb-16 px-6 mt-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight">From raw lecture to study-ready</h2>
            <p className="text-muted-foreground mt-2 text-[15px]">Three steps. Fully automated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: "01", icon: Mic,      title: "Upload your lecture",   desc: "Drop a video, audio file, slides, or paste a YouTube link." },
              { num: "02", icon: Brain,    title: "AI processes it",        desc: "Transcription, OCR, and dual-model summarization run in the background." },
              { num: "03", icon: FileText, title: "Learn & quiz yourself",  desc: "Review smart summaries and take auto-generated MCQ quizzes." },
            ].map((s) => (
              <div key={s.num}
                className="bg-card rounded-2xl p-6 border border-border shadow-warm group hover:border-primary/30 transition-colors duration-150">
                <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{s.num}</span>
                <div className="mt-4 mb-4 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-6 border-t border-border bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Platform features</p>
            <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight">Everything to learn smarter</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BookOpen,  title: "Multi-format upload",     desc: "Video, audio, PPT, PDF, or YouTube links." },
              { icon: Mic,       title: "AI transcription",         desc: "English & Hindi with timestamps via Vosk + GPT-4." },
              { icon: Brain,     title: "Dual AI summaries",        desc: "BART model + OpenAI for best-in-class output." },
              { icon: FileText,  title: "Auto-generated quizzes",   desc: "MCQs created directly from lecture content." },
              { icon: BarChart3, title: "Performance analytics",    desc: "Score history, weak areas, and peer rankings." },
              { icon: Sparkles,  title: "Real-time AI pipeline",    desc: "Background processing with live status." },
            ].map((f) => (
              <div key={f.title}
                className="group flex gap-4 p-5 rounded-xl bg-card border border-border shadow-warm hover:border-primary/25 hover:shadow-warm-md transition-all duration-150 cursor-default"
              >
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] mb-1">{f.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <div className="bg-foreground rounded-2xl p-10 sm:p-14 text-center shadow-warm-md">
            <div className="h-11 w-11 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-[24px] sm:text-[30px] font-bold tracking-tight text-background mb-3">
              Ready to study smarter?
            </h2>
            <p className="text-background/55 text-[14px] mb-8 max-w-sm mx-auto leading-relaxed">
              Upload your first lecture and see AI study materials appear in minutes.
            </p>
            <Button size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-[14px] font-semibold rounded-xl amber-glow"
              onClick={() => router.push("/auth/signup")}>
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-7 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">Lecture Lens</span>
          </div>
          <p>Next.js · Express · AI</p>
        </div>
      </footer>
    </div>
  )
}
