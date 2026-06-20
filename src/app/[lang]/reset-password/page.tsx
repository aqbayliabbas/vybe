"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';
import { VybeLogo } from '@/components/VybeLogo';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setExchanging(true);
      authService.exchangeCodeForSession(code)
        .then(() => {
          toast.success('Session authentifiée pour la réinitialisation.');
        })
        .catch((err) => {
          console.error(err);
          toast.error('Lien expiré ou invalide.');
          setErrorMsg('Le lien d\'authentification a expiré ou est invalide.');
        })
        .finally(() => {
          setExchanging(false);
        });
    }
  }, []);

  const canSubmit = password.length >= 8 && password === confirm && !loading && !exchanging;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.updatePassword(password);
      toast.success('Mot de passe mis à jour avec succès ! Veuillez vous connecter avec votre nouveau mot de passe.');
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Échec de la mise à jour du mot de passe.');
      toast.error(err.message || 'Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[oklch(0.82_0.1_300_/_0.12)] blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md mx-auto px-6">
        <div className="flex items-center justify-center mb-12">
          <VybeLogo className="scale-110 origin-center" />
        </div>

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8">
          <h1 className="font-heading text-2xl font-bold text-foreground text-center">Définir un nouveau mot de passe</h1>
          <p className="mt-2 text-[13px] text-muted-foreground text-center">Choisissez un mot de passe sécurisé pour votre compte</p>

          {exchanging ? (
            <div className="mt-8 flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-vybe" />
              <p className="text-sm text-muted-foreground">Authentification de la session en cours...</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nouveau mot de passe</label>
                <div className="relative">
                  <Input 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="Min. 8 caractères" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="pr-10" 
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground bg-transparent border-0 cursor-pointer"
                    disabled={loading}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${password.length >= 8 ? (i < 3 ? 'bg-success' : 'bg-vybe') : i < Math.floor(password.length / 2) ? 'bg-warning' : 'bg-muted'}`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Confirmez le mot de passe</label>
                <Input 
                  type="password" 
                  placeholder="Répétez votre mot de passe" 
                  value={confirm} 
                  onChange={e => setConfirm(e.target.value)} 
                  className={confirm && confirm !== password ? 'border-destructive/60' : ''} 
                  disabled={loading}
                />
                {confirm && confirm !== password && <p className="mt-1.5 text-[11px] text-destructive">Les mots de passe ne correspondent pas</p>}
              </div>

              {errorMsg && (
                <div className="text-[12px] text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <Button type="submit" disabled={!canSubmit} className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement du mot de passe...
                  </>
                ) : (
                  <>
                    Réinitialiser le mot de passe <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
