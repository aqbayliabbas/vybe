"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, ArrowRight, Upload, Loader2, Building2, Scale, Phone } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { brandDetailsService } from '@/lib/db';
import { compressImage } from '@/lib/image-compression';
import { storageService } from '@/lib/storage';
import { toast } from 'sonner';

const industries = ['Food & Beverage', 'Beauty & Cosmetics', 'Tech & Telecom', 'Fashion', 'Sports', 'Retail', 'Healthcare', 'Education', 'Real Estate', 'Automotive', 'Travel & Tourism', 'Other'];
const sizes = ['1–10', '11–50', '51–200', '201–500', '500+'];
const countries = ['Algeria', 'Morocco', 'Tunisia', 'UAE', 'Saudi Arabia', 'Egypt', 'Qatar', 'Kuwait', 'Bahrain', 'Libya', 'Jordan', 'Lebanon', 'Other'];

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { label: 'Infos Marque', icon: Building2 },
    { label: 'Détails Légaux', icon: Scale },
    { label: 'Contact', icon: Phone },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1">
          <div className="flex items-center gap-1.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-300 ${
              i < current
                ? 'bg-success text-white shadow-card'
                : i === current
                ? 'bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-card scale-110'
                : 'bg-muted text-muted-foreground'
            }`}>
              {i < current ? '✓' : <s.icon className="h-3.5 w-3.5" />}
            </div>
            <span className={`text-[11px] font-medium hidden sm:block ${
              i <= current ? 'text-foreground' : 'text-muted-foreground'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-8 mx-1 transition-colors duration-300 ${
              i < current ? 'bg-success/50' : 'bg-border/40'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export { StepIndicator };

export default function OnboardingStep1() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Load existing data if user comes back
  useEffect(() => {
    if (user) {
      brandDetailsService.getBrandDetails(user.id).then(details => {
        if (details) {
          if (details.onboarding_completed) {
            router.push('/dashboard');
            return;
          }
          setCompany(details.company_name || '');
          setIndustry(details.industry || '');
          setSize(details.company_size || '');
          setCountry(details.country || '');
          setWebsite(details.website || '');
          setLogoUrl(details.company_logo_url || null);
        }
      }).catch(() => {});
    }
  }, [user, router]);

  const canSubmit = company.trim().length > 1 && !!industry && !!size && !!country && !saving && !uploading;

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Compress image client-side
      const compressedBlob = await compressImage(file, {
        maxDimension: 600,
        quality: 0.82
      });

      // If we already have a logo uploaded, delete the old one from storage first
      if (logoUrl) {
        try {
          await storageService.deleteBrandLogo(user.id, logoUrl);
        } catch (err) {
          console.warn('Failed to delete old logo from storage:', err);
        }
      }

      // Upload to Supabase Storage
      const url = await storageService.uploadBrandLogo(user.id, compressedBlob);
      setLogoUrl(url);
      toast.success('Logo téléchargé et compressé avec succès !');
    } catch (err: any) {
      console.error('Logo upload failed:', err);
      toast.error(err.message || 'Échec du téléchargement du logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!logoUrl || !user) return;

    setUploading(true);
    try {
      await storageService.deleteBrandLogo(user.id, logoUrl);
      setLogoUrl(null);
      toast.success('Logo supprimé.');
    } catch (err: any) {
      console.error('Logo removal failed:', err);
      toast.error(err.message || 'Échec de la suppression du logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!canSubmit || !user) return;
    setSaving(true);

    try {
      await brandDetailsService.updateBrandDetails(user.id, {
        company_name: company.trim(),
        industry,
        company_size: size,
        country,
        website: website.trim() || null,
        company_logo_url: logoUrl,
      });
      router.push('/onboarding/legal');
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
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.85_0.1_340_/_0.08)] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-6 py-12">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Vybe</span>
        </div>

        <StepIndicator current={0} />

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
              <Building2 className="h-6 w-6 text-vybe" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Configurez votre marque</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">Parlez-nous de votre entreprise pour personnaliser votre expérience</p>
          </div>

          <div className="space-y-4">
            {/* Logo Upload Area */}
            <div className="flex items-center gap-4 mb-2">
              <div className="relative group">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={uploading || saving}
                  className="hidden"
                />
                
                {logoUrl ? (
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-border/40 bg-muted/40 shadow-soft">
                    <img src={logoUrl} alt="Logo Preview" className="h-full w-full object-cover" />
                    {!(uploading || saving) && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                        title="Supprimer le logo"
                      >
                        <span className="text-[10px] text-white font-semibold">Supprimer</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="logo-upload"
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      uploading
                        ? 'border-muted bg-muted/10'
                        : 'border-border/60 bg-muted/30 cursor-pointer hover:border-vybe/40 hover:bg-vybe/5'
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 text-vybe animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground/60 group-hover:text-vybe transition-colors" />
                    )}
                  </label>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-foreground">Logo de la marque <span className="text-muted-foreground/60">(facultatif)</span></p>
                {uploading ? (
                  <p className="text-[11px] text-vybe animate-pulse font-medium">Compression & téléchargement...</p>
                ) : logoUrl ? (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    disabled={saving}
                    className="text-[11px] text-destructive hover:underline text-left cursor-pointer"
                  >
                    Supprimer l'image du logo
                  </button>
                ) : (
                  <p className="text-[11px] text-muted-foreground">JPEG/PNG, compressé automatiquement pour mobile</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Nom de l'entreprise <span className="text-destructive">*</span></label>
              <Input placeholder="ex. Pepsi Algeria" value={company} onChange={e => setCompany(e.target.value)} disabled={saving || uploading} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Secteur d'activité <span className="text-destructive">*</span></label>
                <Select value={industry} onValueChange={setIndustry} disabled={saving || uploading}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Taille de l'entreprise <span className="text-destructive">*</span></label>
                <Select value={size} onValueChange={setSize} disabled={saving || uploading}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{sizes.map(s => <SelectItem key={s} value={s}>{s} employés</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Pays <span className="text-destructive">*</span></label>
              <Select value={country} onValueChange={setCountry} disabled={saving || uploading}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un pays" /></SelectTrigger>
                <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Site web <span className="text-muted-foreground/60">(facultatif)</span></label>
              <Input placeholder="https://brand.com" value={website} onChange={e => setWebsite(e.target.value)} disabled={saving || uploading} />
            </div>

            <Button onClick={handleContinue} disabled={!canSubmit} className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft mt-2">
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</>
              ) : (
                <>Continuer <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground/60">
          Étape 1 sur 3 — Vous pourrez modifier cela plus tard dans les Paramètres
        </p>
      </div>
    </div>
  );
}
