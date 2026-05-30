"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight, RotateCw, Loader2 } from 'lucide-react';
import { authService } from '@/lib/auth';
import { toast } from 'sonner';

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('your email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Read email from sessionStorage
    const storedEmail = sessionStorage.getItem('vybe_signup_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }

    refs.current[0]?.focus();
    const t = setInterval(() => setCooldown(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const filled = code.every(c => c !== '') && !loading;

  const handleVerify = async () => {
    if (!filled) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const otpCode = code.join('');
      await authService.verifyOtp(email, otpCode);
      toast.success('Email verified successfully!');
      router.push('/signup/profile');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Verification failed. Please check the code and try again.');
      toast.error(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      setCooldown(60);
      toast.success('Verification code resent successfully.');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to resend code.');
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
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-vybe/15 to-vybe-glow/10">
            <svg className="h-7 w-7 text-vybe" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Verify your email</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">We sent a 6-digit code to <strong className="text-foreground">{email}</strong></p>

          <div className="mt-8 flex justify-center gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={loading}
                className="h-14 w-12 rounded-2xl border border-border/60 bg-white/70 text-center text-xl font-bold text-foreground outline-none transition-all focus:border-vybe/60 focus:ring-2 focus:ring-vybe/20"
              />
            ))}
          </div>

          {errorMsg && (
            <div className="mt-5 text-[12px] text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <Button onClick={handleVerify} disabled={!filled} className="mt-8 w-full h-11 rounded-2xl text-[13px] font-semibold gap-2 shadow-soft">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Verify <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground">
            <span>Didn&apos;t receive the code?</span>
            <button
              disabled={cooldown > 0 || loading}
              onClick={handleResend}
              className="inline-flex items-center gap-1 font-semibold text-vybe-dark hover:underline disabled:opacity-50 disabled:no-underline bg-transparent border-0 cursor-pointer"
            >
              <RotateCw className="h-3 w-3" /> {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
