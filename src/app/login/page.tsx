import React from 'react';
import { redirect } from 'next/navigation';
import { DEMO_USERS, getRolePermissions } from '../../lib/session';
import { loginUser, getCurrentUser } from '../../lib/auth';
import { KeyRound, Mail, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error || '';
  const message = resolvedParams.message || '';
  
  // If user is already logged in (and not a public visitor), redirect them to console
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.role !== 'Public Visitor') {
    redirect('/console');
  }

  // Server Action to authenticate credentials
  async function handleCredentialsLogin(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      redirect('/login?error=Please fill in all fields');
    }

    // Verify user in the predefined list
    const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!matchedUser) {
      redirect('/login?error=Invalid email or password');
    }

    // Accept standard default password for demonstration
    const isValidPassword = password === 'clisp2026' || password === 'password';
    if (!isValidPassword) {
      redirect('/login?error=Invalid credentials. Hint: use clisp2026');
    }

    // Set secure cookie and redirect
    await loginUser(matchedUser.email);
    redirect('/console');
  }

  // Server Action for Quick Login demo buttons
  async function handleQuickLogin(formData: FormData) {
    'use server';
    
    const email = formData.get('email') as string;
    if (email) {
      await loginUser(email);
      redirect('/console');
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative bg-canvas-light">
      
      {/* Decorative blurred background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0A3D91]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[50%] bg-[#1D8F8A]/5 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Standard Credentials Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-body-gray hover:text-primary-indigo transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-border-gray/30 shadow-xl space-y-6">
            
            {/* Branding Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center items-center -space-x-2.5">
                <div className="w-12 h-12 bg-white rounded-full border border-border-gray/30 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src="/mlg-logo.png" alt="MLG Logo" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-12 bg-white rounded-full border border-border-gray/30 flex items-center justify-center overflow-hidden shadow-sm z-10">
                  <img src="/clef-logo.png" alt="CLEF Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-ink font-display uppercase tracking-tight">CLISP<span className="text-coast-teal">Connect</span></h2>
                <p className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Secure Portal Sign In</p>
              </div>
            </div>

            {/* Error / Info messages */}
            {error && (
              <div className="p-3.5 rounded-xl bg-signal-red/10 border border-signal-red/20 text-signal-red text-xs flex items-start gap-2 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {message && (
              <div className="p-3.5 rounded-xl bg-civic-green/10 border border-civic-green/20 text-civic-green text-xs flex items-start gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {/* Login Form */}
            <form action={handleCredentialsLogin} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-body-gray/50" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your administrative email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl glass-input text-ink"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-body-gray tracking-wider">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 w-4 h-4 text-body-gray/50" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl glass-input text-ink"
                  />
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-body-gray font-light">Hint: Demo password is <strong className="font-mono text-primary-indigo font-bold">clisp2026</strong></span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-primary-indigo hover:bg-hover-indigo text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Right: Stakeholder Quick Login Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-8 rounded-3xl glass-panel border border-border-gray/30 shadow-xl space-y-5">
            <div className="border-b border-border-gray/30 pb-3">
              <h3 className="text-sm font-bold text-ink uppercase tracking-wide">Stakeholder Quick Login (Demo Access)</h3>
              <p className="text-[10px] text-body-gray">Select any profile to instantly simulate that role's dashboard workspace.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {DEMO_USERS.map((user) => {
                const perms = getRolePermissions(user.role);
                return (
                  <form key={user.email} action={handleQuickLogin}>
                    <input type="hidden" name="email" value={user.email} />
                    <button
                      type="submit"
                      className="w-full p-3.5 rounded-xl border border-border-gray/30 hover:border-primary-indigo bg-white/40 hover:bg-white/90 text-left transition-all group flex flex-col justify-between h-28 cursor-pointer shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs text-ink group-hover:text-primary-indigo transition-colors leading-tight block">{user.name}</strong>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                            perms.isNationalAdmin ? 'bg-primary-indigo/10 text-primary-indigo' :
                            perms.isCoordinator ? 'bg-coast-teal/10 text-coast-teal' :
                            user.role === 'Public Visitor' ? 'bg-body-gray/10 text-body-gray' :
                            'bg-sand-gold/10 text-sand-gold'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-body-gray leading-tight font-normal line-clamp-2 mt-1">{user.description}</p>
                      </div>
                      <span className="text-[8px] font-mono text-body-gray/50 group-hover:text-primary-indigo/70 truncate w-full block mt-1">{user.email}</span>
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
