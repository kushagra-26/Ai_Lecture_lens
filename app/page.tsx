"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mic, Brain, FileText, BarChart3, Sparkles, GraduationCap, CheckCircle } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAppStore()

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard")
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">Lecture Lens</span>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-[13px] h-8"
              onClick={() => router.push("/auth/login")}>
              Sign in
            </Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 text-[13px] h-8 px-4 rounded-lg"
              onClick={() => router.push("/auth/signup")}>
              Get started
            </Button>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            AI-powered academic platform
          </div>

          <h1 className="text-[52px] sm:text-[64px] font-bold tracking-[-0.03em] leading-[1.05] mb-6 text-foreground">
            Turn any lecture into
            <br />
            <span className="text-primary">structured knowledge</span>
          </h1>

          <p className="text-[17px] text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10">
            Upload video, audio, or slides. Get AI transcripts, concise summaries,
            and self-assessment quizzes in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-11 px-7 text-[14px] font-medium rounded-xl shadow-warm-md transition-all hover:scale-[1.01]"
              onClick={() => router.push("/auth/signup")}
            >
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 text-[14px] rounded-xl border-border text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/auth/login")}
            >
              Sign in to dashboard
            </Button>
          </div>

          {/* Trust line */}
          <div className="flex items-center justify-center gap-5 mt-10">
            {["Free to start", "No credit card", "AI-powered"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* ── How it works ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">How it works</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              From raw lecture to study-ready
            </h2>
            <p className="text-muted-foreground mt-2 text-[15px]">Three steps, fully automated.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", icon: Mic, title: "Upload your lecture", desc: "Drop a video, audio file, slides, or paste a YouTube link." },
              { num: "02", icon: Brain, title: "AI processes it", desc: "Transcription, OCR, and dual-model summarization run in the background." },
              { num: "03", icon: FileText, title: "Learn & quiz yourself", desc: "Review smart summaries and take auto-generated MCQ quizzes." },
            ].map((step) => (
              <div key={step.num} className="bg-card rounded-2xl p-6 border border-border shadow-warm group hover:border-primary/25 transition-colors duration-200">
                <span className="text-[11px] font-bold text-primary/50 uppercase tracking-widest">{step.num}</span>
                <div className="mt-4 mb-4 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-[15px] mb-2 text-foreground">{step.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Platform features</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Everything you need to learn smarter</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: GraduationCap, title: "Multi-format upload", desc: "Video, audio, PPT, PDF, or YouTube links all supported." },
              { icon: Mic, title: "AI transcription", desc: "English and Hindi with timestamps from Vosk + OpenAI." },
              { icon: Brain, title: "Dual AI summaries", desc: "Local BART model combined with GPT-4 for best output." },
              { icon: FileText, title: "Auto-generated quizzes", desc: "MCQs created directly from your lecture content." },
              { icon: BarChart3, title: "Performance analytics", desc: "Score history, weak areas, and peer ranking." },
              { icon: Sparkles, title: "Real-time AI pipeline", desc: "Background processing with live status updates." },
            ].map((f) => (
              <div key={f.title}
                className="group flex gap-4 p-5 rounded-xl bg-card border border-border shadow-warm hover:border-primary/25 hover:shadow-warm-md transition-all duration-200 cursor-default"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-[14px] mb-1 text-foreground">{f.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-foreground text-background rounded-3xl p-12 text-center shadow-warm-md">
            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">Ready to study smarter?</h2>
            <p className="text-white/60 text-[14px] mb-8 max-w-sm mx-auto leading-relaxed">
              Upload your first lecture and get AI-generated study materials in minutes.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-[14px] font-medium rounded-xl amber-glow"
              onClick={() => router.push("/auth/signup")}
            >
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">Lecture Lens</span>
          </div>
          <p>Next.js · Express · AI</p>
        </div>
      </footer>
    </div>
  )
}
