'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password, rememberMe });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('devs@neximet.com');
    setPassword('devs@123');
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 p-0.5 shadow-xl mb-4 group hover:scale-105 transition-all duration-300">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center justify-center gap-2">
          <span>Dealer Socket</span>
          <span className="text-slate-500 font-light">Automation</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 tracking-wide">
          Next-Gen Automotive CRM & Lead Ingestion Portal
        </p>
      </div>

      {/* Card Form */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl relative overflow-hidden">
        <div className="mb-6 relative z-10">
          <h2 className="text-base font-semibold text-slate-900 tracking-tight">
            Account Sign In
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access dealership pipeline, ingestion feeds, and telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <Input
            label="Work Email"
            type="email"
            id="auth-email-input"
            placeholder="devs@neximet.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="auth-password-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-slate-700 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400" />
                )}
              </button>
            }
            required
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset instructions sent to dealership admin.');
              }}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              id="auth-login-button"
              variant="primary"
              className="w-full py-2.5 text-sm font-semibold tracking-wide"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Sign In to Automation Hub
            </Button>
          </div>
        </form>

        {/* 1-Click Auto-Fill Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-100 relative z-10">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <span className="block text-slate-800 font-medium">Quick Credentials</span>
              <span className="text-[11px] text-slate-400">devs@neximet.com</span>
            </div>
            <button
              type="button"
              id="fill-demo-credentials"
              onClick={handleFillDemo}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              Auto-fill Devs
            </button>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Enterprise 256-Bit TLS • Dealer Socket Automation Certified</span>
      </div>
    </div>
  );
}
