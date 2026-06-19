"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowLeft, Phone, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { brandDetailsService } from '@/lib/db';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { StepIndicator } from '../page';

export default function OnboardingStep3() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [facebook, setFacebook] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load existing data
  useEffect(() => {
    if (user) {
      brandDetailsService.getBrandDetails(user.id).then(details => {
        if (details) {
          if (details.onboarding_completed) {
            router.push('/dashboard');
            return;
          }
          setPhone(details.contact_phone || '');
          setContactEmail(details.contact_email || user.email || '');
          setInstagram(details.instagram_url || '');
          setTiktok(details.tiktok_url || '');
          setFacebook(details.facebook_url || '');
        } else {
          setContactEmail(user.email || '');
        }
      }).catch(() => {
        setContactEmail(user.email || '');
      });
    }
  }, [user, router]);

  const canSubmit = phone.trim().length > 5 && contactEmail.includes('@') && !saving;

  const handleFinish = async () => {
    if (!canSubmit || !user) return;
    setSaving(true);

    try {
      // Save contact details and mark onboarding complete
      await brandDetailsService.updateBrandDetails(user.id, {
        contact_phone: phone.trim(),
        contact_email: contactEmail.trim(),
        instagram_url: instagram.trim() || null,
        tiktok_url: tiktok.trim() || null,
        facebook_url: facebook.trim() || null,
        onboarding_completed: true,
      });

      // Set the onboarding cookie for proxy.ts
      if (typeof document !== 'undefined') {
        const date = new Date();
        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
        document.cookie = `vybe_onboarding_complete=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
      }

      toast.success('Configuration terminée ! Bienvenue sur Vybe 🚀');
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Échec de l\'enregistrement. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-vybe" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.08)] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-6 py-12">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Vybe</span>
        </div>

        <StepIndicator current={2} />

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
              <Phone className="h-6 w-6 text-vybe" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Contact & réseaux sociaux</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">Comment les créateurs et notre équipe peuvent-ils vous joindre ?</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone professionnel <span className="text-destructive">*</span></label>
              <Input placeholder="+213 555 12 34 56" value={phone} onChange={e => setPhone(e.target.value)} disabled={saving} />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email de contact <span className="text-destructive">*</span></label>
              <Input type="email" placeholder="contact@brand.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} disabled={saving} />
              <p className="mt-1 text-[11px] text-muted-foreground">Utilisé pour les communications commerciales et les factures</p>
            </div>

            <div className="pt-3">
              <p className="text-sm font-medium text-foreground mb-1">Réseaux sociaux <span className="text-muted-foreground/60">(facultatif)</span></p>
              <p className="text-[11px] text-muted-foreground mb-3">Aidez les créateurs à découvrir et vérifier votre marque</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                    <svg className="h-4 w-4 text-pink-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <Input placeholder="https://instagram.com/yourbrand" value={instagram} onChange={e => setInstagram(e.target.value)} disabled={saving} className="flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900/10 to-gray-700/10">
                    <svg className="h-4 w-4 text-gray-800" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.88-4.49V8.77a8.24 8.24 0 004.84 1.56V6.89a4.84 4.84 0 01-1.14-.2z"/></svg>
                  </div>
                  <Input placeholder="https://tiktok.com/@yourbrand" value={tiktok} onChange={e => setTiktok(e.target.value)} disabled={saving} className="flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                    <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <Input placeholder="https://facebook.com/yourbrand" value={facebook} onChange={e => setFacebook(e.target.value)} disabled={saving} className="flex-1" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={() => router.push('/onboarding/legal')} disabled={saving} className="h-11 rounded-2xl text-[13px] font-medium glass border-border/40 gap-2 flex-1">
                <ArrowLeft className="h-4 w-4" /> Retour
              </Button>
              <Button onClick={handleFinish} disabled={!canSubmit} className="h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft flex-[2] bg-gradient-to-r from-vybe to-vybe-glow">
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Finalisation...</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Terminer la configuration</>
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Étape 3 sur 3 — Presque terminé !
        </p>
      </div>
    </div>
  );
}
