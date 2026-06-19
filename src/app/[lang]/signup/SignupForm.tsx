/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Eye, EyeOff, Loader2, UserCircle2, Building2 } from 'lucide-react';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function SignupForm({ dict, lang }: { dict: any, lang: string }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<'brand' | 'creator'>('creator');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const canSubmit = name.trim().length > 1 && email.includes('@') && password.length >= 8 && !loading && !googleLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.signUp(email, password, name, role);
      sessionStorage.setItem('vybe_signup_email', email);
      toast.success(dict.success_signup);
      router.push(`/${lang}/signup/verify`);
    } catch (err: any) {
      console.error("Signup error details:", err);
      const isFetchError = err.message === 'Failed to fetch' || err.name === 'AuthRetryableFetchError' || (err.message && err.message.includes('fetch'));
      const friendlyMsg = isFetchError
        ? dict.error_supabase
        : err.message || dict.error_signup;
      setErrorMsg(friendlyMsg);
      toast.error(dict.error_signup);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    try {
      await authService.signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      const isFetchError = err.message === 'Failed to fetch' || err.name === 'AuthRetryableFetchError' || (err.message && err.message.includes('fetch'));
      const friendlyMsg = isFetchError
        ? dict.error_supabase
        : err.message || dict.error_google;
      setErrorMsg(friendlyMsg);
      toast.error(dict.error_google);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="mb-10 text-center md:text-start">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">{dict.signup_title}</h1>
        <p className="text-[15px] text-muted-foreground">{dict.signup_subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2.5">
          <label className="text-[13px] font-medium text-foreground ml-1">{dict.i_am_a}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                role === 'creator'
                  ? 'border-vybe bg-vybe/5 text-vybe'
                  : 'border-transparent bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              disabled={loading || googleLoading}
            >
              <UserCircle2 className="h-6 w-6" />
              <span className="text-[13px] font-semibold">{dict.creator}</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('brand')}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                role === 'brand'
                  ? 'border-[#ea2d3e] bg-[#ea2d3e]/5 text-[#ea2d3e]'
                  : 'border-transparent bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10'
              }`}
              disabled={loading || googleLoading}
            >
              <Building2 className="h-6 w-6" />
              <span className="text-[13px] font-semibold">{dict.brand}</span>
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-foreground ml-1">{dict.fullname_label}</label>
          <Input 
            placeholder={dict.fullname_placeholder} 
            value={name} 
            onChange={e => setName(e.target.value)} 
            disabled={loading || googleLoading}
            className="h-12 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border-transparent focus:border-vybe/50 focus:bg-background transition-all shadow-none"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-foreground ml-1">{dict.work_email_label}</label>
          <Input 
            type="email" 
            placeholder={dict.email_placeholder} 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            disabled={loading || googleLoading}
            className="h-12 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border-transparent focus:border-vybe/50 focus:bg-background transition-all shadow-none"
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-foreground ml-1">{dict.password_label}</label>
          <div className="relative">
            <Input
              type={showPw ? 'text' : 'password'}
              placeholder={dict.password_placeholder_signup}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-12 px-4 pr-12 rounded-2xl bg-black/5 dark:bg-white/5 border-transparent focus:border-vybe/50 focus:bg-background transition-all shadow-none"
              disabled={loading || googleLoading}
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)} 
              className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading || googleLoading}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="text-[13px] text-red-500 bg-red-500/10 p-4 rounded-2xl border border-red-500/20 font-medium animate-in fade-in slide-in-from-top-2">
            {errorMsg}
          </div>
        )}

        <Button type="submit" disabled={!canSubmit} className={`w-full h-12 rounded-2xl text-[14px] font-semibold text-white hover:opacity-90 shadow-lg transition-all mt-2 ${role === 'brand' ? 'bg-gradient-to-r from-[#ea2d3e] to-[#ff4757] shadow-[#ea2d3e]/25' : 'bg-gradient-to-r from-[#f7931e] to-[#ea2d3e] shadow-vybe/25'}`}>
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" /> {dict.signing_up}</>
          ) : (
            <>{dict.signup_button} <ArrowRight className="h-4 w-4 ltr:ml-2 rtl:mr-2" /></>
          )}
        </Button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-[12px] text-muted-foreground uppercase tracking-widest font-medium">{dict.or}</span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        disabled={loading || googleLoading}
        className="w-full h-12 rounded-2xl text-[14px] font-medium bg-background border-border hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-sm"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin ltr:mr-2 rtl:ml-2" />
        ) : (
          <svg className="ltr:mr-3 rtl:ml-3 h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        )}
        {dict.google_button}
      </Button>

      <p className="mt-8 text-center text-[13px] text-muted-foreground">
        {dict.already_have_account} <Link href={`/${lang}/login`} className="font-semibold text-foreground hover:text-vybe transition-colors">{dict.login_link}</Link>
      </p>

      <p className="mt-6 text-center text-[12px] text-muted-foreground/70 leading-relaxed">
        {dict.terms_text} <Link href={`/${lang}/terms`} className="underline hover:text-foreground transition-colors">{dict.terms_link}</Link> {dict.privacy_text} <Link href={`/${lang}/privacy`} className="underline hover:text-foreground transition-colors">{dict.privacy_link}</Link>.
      </p>
    </div>
  );
}
