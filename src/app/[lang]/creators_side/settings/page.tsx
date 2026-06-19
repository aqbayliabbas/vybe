"use client";

import { useAuth } from "@/components/AuthProvider";
import { Camera, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { profileService, Profile } from "@/lib/db";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        if (user) {
          const p = await profileService.getProfile(user.id);
          if (p && mounted) {
            setProfile(p);
            setFullName(p.full_name || "");
            setBio(p.bio || "");
            setLocation(p.location || "");
          } else if (mounted) {
            // fallback to auth meta
            setFullName(user.user_metadata?.full_name || "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await profileService.updateProfile(user.id, {
        full_name: fullName,
        bio,
        location
      });
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Échec de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const displayEmail = user?.email || "creator@example.com";

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-6 w-48 bg-muted rounded-full mb-2" />
          <div className="h-4 w-64 bg-muted/60 rounded-full" />
        </div>

        <div className="flex items-center gap-6 pb-8 border-b border-border/40">
          <div className="w-24 h-24 rounded-3xl bg-muted" />
          <div>
            <div className="h-10 w-32 bg-muted rounded-xl mb-3" />
            <div className="h-3 w-48 bg-muted/60 rounded-full" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="h-3 w-20 bg-muted/60 rounded-full" />
              <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted/60 rounded-full" />
              <div className="h-12 w-full bg-muted rounded-xl" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted/60 rounded-full" />
            <div className="h-32 w-full bg-muted rounded-xl" />
          </div>

          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted/60 rounded-full" />
            <div className="h-12 w-full bg-muted rounded-xl" />
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex justify-end">
          <div className="h-11 w-40 bg-muted rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-lg font-bold text-foreground">Informations du profil</h2>
        <p className="text-[13px] font-medium text-muted-foreground mt-1">
          Mettez à jour votre profil public et vos informations de créateur.
        </p>
      </div>

      <div className="flex items-center gap-6 pb-8 border-b border-border/40">
        <div className="relative w-24 h-24 rounded-3xl bg-muted border border-border/40 overflow-hidden shadow-sm group">
          <Image 
            src={profile?.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
            alt="Profile"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <Button variant="outline" className="h-10 rounded-xl px-5 text-[13px] font-bold shadow-sm">
            Changer d'avatar
          </Button>
          <p className="text-[11px] font-medium text-muted-foreground mt-3 uppercase tracking-wider">JPG, GIF ou PNG. Taille max de 5 Mo.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nom complet</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-foreground text-[13px] font-semibold focus:outline-none focus:border-vybe/50 focus:ring-1 focus:ring-vybe/50 shadow-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Adresse email</label>
            <input 
              type="email" 
              value={displayEmail}
              disabled
              className="w-full px-4 py-3 bg-muted/30 border border-border/40 rounded-xl text-muted-foreground text-[13px] font-medium cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Biographie</label>
          <textarea 
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-foreground text-[13px] font-semibold focus:outline-none focus:border-vybe/50 focus:ring-1 focus:ring-vybe/50 shadow-sm transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Emplacement</label>
          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-foreground text-[13px] font-semibold focus:outline-none focus:border-vybe/50 focus:ring-1 focus:ring-vybe/50 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="pt-8 border-t border-border/40 flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-8 rounded-full bg-gradient-to-br from-vybe to-vybe-glow text-white text-[13px] font-bold shadow-[0_8px_24px_-8px_oklch(0.72_0.14_300_/_0.5)] transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}
