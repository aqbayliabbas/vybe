/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities, @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, ArrowRight, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { db } from '@/lib/db';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

const niches = ['Beauté', 'Mode', 'Tech', 'Cuisine', 'Voyage', 'Comédie', 'Sport', 'Autre'];
const countries = ['Algérie', 'Maroc', 'Tunisie', 'EAU', 'Arabie Saoudite', 'Égypte', 'Qatar', 'Koweït', 'Bahreïn', 'Autre'];
const platforms = ['TikTok', 'Instagram', 'YouTube'];

export default function CreatorProfileSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [niche, setNiche] = useState('');
  const [country, setCountry] = useState('');
  
  // Social Metrics
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [avgViews, setAvgViews] = useState('');
  const [engagementRate, setEngagementRate] = useState('');

  const canSubmit = name.trim().length > 1 
    && !!niche 
    && !!country 
    && !!platform 
    && username.trim().length > 0
    && followers.length > 0 
    && avgViews.length > 0 
    && engagementRate.length > 0
    && !loading;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour continuer.");
      return;
    }

    setLoading(true);
    try {
      const success = await db.saveCreatorOnboarding(user.id, {
        name,
        avatar_url: avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`,
        niche,
        country,
        platform,
        username,
        follower_count: parseInt(followers, 10),
        avg_views: parseInt(avgViews, 10),
        engagement_rate: parseFloat(engagementRate)
      });

      if (success) {
        toast.success("Profil créé avec succès !");
        router.push('/creators_side');
      } else {
        toast.error("Échec de la sauvegarde de votre profil.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden py-12">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Vybe</span>
        </div>

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground text-center">Configurez votre profil de créateur</h1>
          <p className="mt-2 text-[13px] text-muted-foreground text-center">Présentez-vous aux marques et connectez vos comptes</p>

          <div className="mt-8 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/30 pb-2">Informations de base</h3>
              
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 overflow-hidden items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 cursor-pointer hover:border-vybe/40 transition-colors">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-medium text-foreground mb-1">URL de la photo de profil <span className="text-muted-foreground/60">(optionnel)</span></label>
                  <Input placeholder="https://..." value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="h-9 text-[13px]" />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-foreground mb-1">Nom d'affichage</label>
                <Input placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Niche principale</label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{niches.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Pays</label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Social Metrics */}
            <div className="space-y-4 pt-2">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/30 pb-2">Réseaux Sociaux</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Plateforme principale</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>{platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Nom d'utilisateur / Handle</label>
                  <Input placeholder="@votre_handle" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Abonnés</label>
                  <Input type="number" placeholder="Ex: 50000" value={followers} onChange={e => setFollowers(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Vues Moy.</label>
                  <Input type="number" placeholder="Ex: 15000" value={avgViews} onChange={e => setAvgViews(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-foreground mb-1">Taux d'Eng. (%)</label>
                  <Input type="number" step="0.1" placeholder="Ex: 4.5" value={engagementRate} onChange={e => setEngagementRate(e.target.value)} />
                </div>
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft mt-4">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Terminer l'inscription <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
