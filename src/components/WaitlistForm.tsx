"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, User, Phone, AtSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WaitlistFormProps {
  dict?: {
    placeholder_name?: string;
    placeholder_whatsapp?: string;
    placeholder_pseudo?: string;
    joining?: string;
    join_button?: string;
    success_title?: string;
    success_desc?: string;
    error_fallback?: string;
    // Fallback for legacy keys if any
    placeholder?: string;
  };
}

export default function WaitlistForm({ dict }: WaitlistFormProps) {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [pseudo, setPseudo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !whatsapp || !pseudo || status === "loading" || status === "done") return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, whatsapp, platform, pseudo }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? (dict?.error_fallback || "Une erreur est survenue."));
      }

      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : (dict?.error_fallback || "Une erreur est survenue."));
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl glass border border-success/30 px-8 py-5 shadow-card w-full max-w-xl mx-auto">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-5 w-5 text-success" />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-semibold text-foreground">
            {dict?.success_title || "Vous êtes sur la liste d'attente !"}
          </p>
          <p className="text-[12px] text-muted-foreground font-light mt-0.5">
            Nous contacterons <span className="text-foreground font-medium">{fullName}</span> sur WhatsApp très bientôt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        
        {/* Nom & Prénom */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="waitlist-name"
            type="text"
            required
            placeholder={dict?.placeholder_name || "Nom et Prénom"}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading"}
            className="w-full rounded-2xl glass border border-border/40 bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200 h-12 disabled:opacity-60"
          />
        </div>

        {/* WhatsApp */}
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            id="waitlist-whatsapp"
            type="tel"
            required
            placeholder={dict?.placeholder_whatsapp || "Numéro WhatsApp (+213...)"}
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            disabled={status === "loading"}
            className="w-full rounded-2xl glass border border-border/40 bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200 h-12 disabled:opacity-60"
          />
        </div>

        {/* Pseudo (Instagram/TikTok) */}
        <div className="flex gap-2 relative">
          <div className="relative flex-1">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              id="waitlist-pseudo"
              type="text"
              required
              placeholder={dict?.placeholder_pseudo || "@pseudo"}
              value={pseudo}
              onChange={(e) => {
                setPseudo(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              disabled={status === "loading"}
              className="w-full rounded-2xl glass border border-border/40 bg-transparent pl-11 pr-4 py-3.5 text-[14px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200 h-12 disabled:opacity-60"
            />
          </div>
          <Select
            value={platform}
            onValueChange={(val) => setPlatform(val as "instagram" | "tiktok")}
            disabled={status === "loading"}
          >
            <SelectTrigger className="w-36 rounded-2xl h-12 glass border border-border/40 bg-transparent px-4 py-3.5 text-[14px] text-foreground outline-none focus:border-vybe/50 focus:ring-2 focus:ring-vybe/10 transition-all duration-200 disabled:opacity-60">
              <SelectValue placeholder="Plateforme" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40 glass-strong backdrop-blur-xl">
              <SelectItem value="instagram" className="rounded-lg cursor-pointer hover:bg-vybe/10">Instagram</SelectItem>
              <SelectItem value="tiktok" className="rounded-lg cursor-pointer hover:bg-vybe/10">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] text-white font-semibold text-[14px] px-6 h-12 shadow-soft hover:shadow-elevated hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {dict?.joining || "Rejoindre…"}
            </>
          ) : (
            <>
              {dict?.join_button || "Rejoindre la liste d'attente"}
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
