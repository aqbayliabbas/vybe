"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, ArrowLeft, Scale, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { brandDetailsService } from '@/lib/db';
import { toast } from 'sonner';
import { StepIndicator } from '../page';

export default function OnboardingStep2() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [legalName, setLegalName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [postalCode, setPostalCode] = useState('');
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
          setLegalName(details.legal_name || '');
          setRegNumber(details.registration_number || '');
          setTaxId(details.tax_id || '');
          setAddress(details.legal_address || '');
          setCity(details.city || '');
          setWilaya(details.wilaya_state || '');
          setPostalCode(details.postal_code || '');
        }
      }).catch(() => {});
    }
  }, [user, router]);

  const canSubmit = legalName.trim().length > 1 && regNumber.trim().length > 1 && !saving;

  const handleContinue = async () => {
    if (!canSubmit || !user) return;
    setSaving(true);

    try {
      await brandDetailsService.updateBrandDetails(user.id, {
        legal_name: legalName.trim(),
        registration_number: regNumber.trim(),
        tax_id: taxId.trim() || null,
        legal_address: address.trim() || null,
        city: city.trim() || null,
        wilaya_state: wilaya.trim() || null,
        postal_code: postalCode.trim() || null,
      });
      router.push('/onboarding/contact');
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

        <StepIndicator current={1} />

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
              <Scale className="h-6 w-6 text-vybe" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Informations légales et officielles</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">Nous en avons besoin pour vérifier votre entreprise et activer les paiements</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'entité légale <span className="text-destructive">*</span></label>
              <Input placeholder="ex. SARL Pepsi Algeria" value={legalName} onChange={e => setLegalName(e.target.value)} disabled={saving} />
              <p className="mt-1 text-[11px] text-muted-foreground">Tel qu'enregistré auprès de votre gouvernement</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Numéro d'immatriculation (RC) <span className="text-destructive">*</span></label>
                <Input placeholder="ex. 16/00-123456" value={regNumber} onChange={e => setRegNumber(e.target.value)} disabled={saving} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Identifiant fiscal (NIF) <span className="text-muted-foreground/60">(facultatif)</span></label>
                <Input placeholder="ex. 001516012345678" value={taxId} onChange={e => setTaxId(e.target.value)} disabled={saving} />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-3">Adresse enregistrée</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1">Adresse postale</label>
                  <Input placeholder="123 Rue Didouche Mourad" value={address} onChange={e => setAddress(e.target.value)} disabled={saving} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-muted-foreground mb-1">Ville</label>
                    <Input placeholder="Alger" value={city} onChange={e => setCity(e.target.value)} disabled={saving} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-muted-foreground mb-1">Wilaya / État</label>
                    <Input placeholder="Alger" value={wilaya} onChange={e => setWilaya(e.target.value)} disabled={saving} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-muted-foreground mb-1">Code postal</label>
                    <Input placeholder="16000" value={postalCode} onChange={e => setPostalCode(e.target.value)} disabled={saving} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={() => router.push('/onboarding')} disabled={saving} className="h-11 rounded-2xl text-[13px] font-medium glass border-border/40 gap-2 flex-1">
                <ArrowLeft className="h-4 w-4" /> Retour
              </Button>
              <Button onClick={handleContinue} disabled={!canSubmit} className="h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft flex-[2]">
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</>
                ) : (
                  <>Continuer <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Étape 2 sur 3 — Vos informations sont stockées en toute sécurité
        </p>
      </div>
    </div>
  );
}
