"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Mail, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please enter both email and password');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://www.server.waynexshipping.com/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(errData.error || 'Invalid credentials');
      }

      const data = await response.json();

      if (!data.user?.isAdmin) {
        throw new Error('Access denied. Admin privileges required.');
      }

      setSession({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        isAdmin: data.user.isAdmin,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#06060a]">
      {/* Full-screen animated background */}
      <div className="absolute inset-0">
        {/* Large gradient orbs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-800/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] bg-violet-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/5 rounded-full blur-[120px]" />

        {/* Radial vignette */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(6,6,10,0.6) 70%, rgba(6,6,10,0.95) 100%)' }} />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Diagonal accent lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diag" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="80" stroke="rgba(168,85,247,0.6)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>

        {/* Top edge glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          {/* Logo glow ring */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 -m-6 rounded-full bg-purple-500/10 blur-2xl" />
            <div className="w-28 h-28 relative rounded-full">
              <Image
                src="/forsvg.svg"
                alt="Waynex Logo"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.25)]"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight text-center">
            Waynex Logistics
          </h1>
          <p className="text-lg text-white/40 mb-16 text-center">
            Administration Portal
          </p>

          {/* Feature pills */}
          <div className="space-y-4 w-full max-w-sm">
            {[
              { label: 'Shipment Management', desc: 'Track and manage all shipments' },
              { label: 'Customer Overview', desc: 'View customer activity and details' },
              { label: 'Payment Monitoring', desc: 'Monitor payments and balances' },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md hover:bg-white/[0.06] hover:border-purple-500/20 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-shadow" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{item.label}</p>
                  <p className="text-xs text-white/30">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider line between panels */}
        <div className="absolute right-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center relative p-6 sm:p-12">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="w-16 h-16 relative">
              <Image
                src="/forsvg.svg"
                alt="Waynex Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Glass form card */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] p-8 sm:p-10 shadow-2xl shadow-purple-900/10">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs font-medium text-purple-300">Admin Access</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-white/40 mt-2">
                Sign in to your admin account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-white/60">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@waynexshipping.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-10 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-white/60">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-10 pr-12 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <span className="text-red-400 text-sm font-bold">!</span>
                  </div>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-500/35 hover:scale-[1.01] active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/15 mt-8">
            Waynex Logistics Admin Panel &middot; Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
}
