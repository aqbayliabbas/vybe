"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canSubmit = email.includes('@') && !loading;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.sendPasswordReset(email);
      setSent(true);
      toast.success('Lien de réinitialisation du mot de passe envoyé !');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Échec de l\'envoi de l\'e-mail de réinitialisation.');
      toast.error(err.message || 'Une erreur s\'est produite.');
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
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-vybe to-vybe-glow shadow-card">
            <Zap className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-foreground">Vybe</span>
        </div>

        <div className="rounded-3xl glass border border-border/30 shadow-soft p-8 text-center">
          {!sent ? (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
                <svg className="h-7 w-7 text-vybe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Mot de passe oublié ?</h1>
              <p className="mt-2 text-[13px] text-muted-foreground">Entrez votre e-mail et nous vous enverrons un lien de réinitialisation</p>

              <form onSubmit={handleResetRequest} className="mt-8 space-y-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Adresse e-mail</label>
                  <Input 
                    type="email" 
                    placeholder="ahmed@brand.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    disabled={loading}
                  />
                </div>

                {errorMsg && (
                  <div className="text-[12px] text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">
                    {errorMsg}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Envoi...
                    </>
                  ) : (
                    <>
                      Envoyer le lien de réinitialisation <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10">
                <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Vérifiez vos e-mails</h1>
              <p className="mt-2 text-[13px] text-muted-foreground">Nous avons envoyé un lien de réinitialisation à <strong className="text-foreground">{email}</strong></p>
              <p className="mt-4 text-[12px] text-muted-foreground/70">Vous ne l&apos;avez pas reçu ? Vérifiez vos spams ou réessayez.</p>
              <Button variant="outline" onClick={() => setSent(false)} className="mt-6 rounded-2xl h-10 text-[13px] glass border-border/40">
                Essayer un autre e-mail
              </Button>
            </>
          )}

          <Link href="/login" className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
