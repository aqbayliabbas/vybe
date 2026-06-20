"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, Mail } from "lucide-react";

interface WaitlistFormProps {
  dict?: {
    placeholder: string;
    joining: string;
    join_button: string;
    success_title: string;
    success_desc: string;
    error_fallback: string;
  };
}

export default function WaitlistForm({ dict }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading" || status === "done") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? (dict?.error_fallback || "Something went wrong. Please try again."));
      }

      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : (dict?.error_fallback || "Something went wrong."));
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl glass border border-success/30 px-8 py-4 shadow-card w-full max-w-xl mx-auto">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-semibold text-foreground">{dict?.success_title || "You're on the waitlist!"}</p>
          <p className="text-[12px] text-muted-foreground font-light">
            {dict?.success_desc ? (
              <>
                {dict.success_desc.split('{email}')[0]}
                <span className="text-foreground font-medium">{email}</span>
                {dict.success_desc.split('{email}')[1]}
              </>
            ) : (
              <>
                We&apos;ll reach out to <span className="text-foreground font-medium">{email}</span> when brands access opens.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full"
      >
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="waitlist-email"
            type="email"
            required
            placeholder={dict?.placeholder || "your@brand.com"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading"}
            className="w-full rounded-2xl glass border border-border/40 bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200 h-12 disabled:opacity-60"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white font-semibold text-[14px] px-6 h-12 shadow-soft hover:shadow-elevated hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {dict?.joining || "Joining…"}
            </>
          ) : (
            <>
              {dict?.join_button || "Join the Waitlist"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-[12px] text-red-400 text-center animate-in fade-in duration-200">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
