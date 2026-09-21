'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Sparkles, Eye, EyeOff, Loader2, Lock, User2, Mail, Briefcase, MapPin, Building } from 'lucide-react';

const ZONES = [
  'North Zone - New Delhi',
  'East Zone - Kolkata',
  'South Zone - Bengaluru',
  'West Zone - Mumbai',
  'Central Zone - Bhopal'
];

export default function LoginPage() {
  const router = useRouter();

  // UI State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_title: '',
    department: '',
    zone: ZONES[0]
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('ss_user_id')) {
        router.replace('/');
      } else if (window.location.search.includes('mode=signup')) {
        setIsLoginMode(false);
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter your credentials to continue.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const json = await res.json();

      if (json.success && json.user) {
        sessionStorage.setItem('ss_user_id', json.user.id);
        sessionStorage.setItem('ss_user_name', json.user.name);
        await new Promise((r) => setTimeout(r, 400)); // UX delay
        router.push('/');
      } else {
        throw new Error(json.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role_title.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.email.toLowerCase().endsWith('@mospi.gov.in')) {
      setError('Only official @mospi.gov.in email addresses are permitted.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success && json.user) {
        sessionStorage.setItem('ss_user_id', json.user.id);
        sessionStorage.setItem('ss_user_name', json.user.name);
        await new Promise((r) => setTimeout(r, 400)); // UX delay
        router.push('/');
      } else {
        throw new Error(json.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1b42] overflow-hidden relative p-4 sm:p-8">

      {/* ══════════════════════════════════════════
          BACKGROUND — Subtle Data Visualizations
      ══════════════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/10 blur-[120px] rounded-full" />
        
        {/* Abstract Grid Line Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Abstract Data Visualizations (Subtle SVG Graphics) */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 600 Q 200 400, 400 500 T 800 300 T 1200 450 T 1600 200" fill="none" stroke="#2563EB" strokeWidth="3" />
            <path d="M-100 700 Q 200 500, 500 600 T 900 400 T 1300 550 T 1700 300" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="400" cy="500" r="6" fill="#60A5FA" />
            <circle cx="800" cy="300" r="6" fill="#60A5FA" />
            <circle cx="1200" cy="450" r="6" fill="#60A5FA" />
            
            {/* Abstract Bars */}
            <rect x="20%" y="70%" width="20" height="150" rx="4" fill="#2563EB" opacity="0.6" />
            <rect x="23%" y="60%" width="20" height="200" rx="4" fill="#60A5FA" opacity="0.4" />
            <rect x="75%" y="65%" width="30" height="220" rx="4" fill="#2563EB" opacity="0.5" />
            <rect x="79%" y="45%" width="30" height="420" rx="4" fill="#60A5FA" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CENTERED CONTENT
      ══════════════════════════════════════════ */}
      <div className={`relative z-10 w-full max-w-md flex flex-col items-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#173B8F] to-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/20 border border-white/10">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 
              className="text-4xl sm:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 drop-shadow-lg pb-1"
              style={{ fontFamily: '"Yatra One", serif' }}
            >
              अध्ययन
            </h1>
            <p className="text-[#8BA4D5] text-sm font-medium mt-1 max-w-[280px]">
              India's Next-Gen Competency & FRAC Platform
            </p>
          </div>
        </div>

        {/* Solid Light Card */}
        <div className="w-full bg-white border border-[#DCE3EF] rounded-2xl p-7 sm:p-8 shadow-2xl">

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-extrabold text-slate-900">
              {isLoginMode ? 'Welcome back' : 'Create profile'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isLoginMode ? 'Sign in to your MoSPI officer account' : 'Generate a profile to test assessments'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-[#F7F9FC] border border-[#DCE3EF] rounded-xl mb-6">
            <button
              onClick={() => { setIsLoginMode(true); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isLoginMode ? 'bg-white text-[#2563EB] shadow-sm border border-[#DCE3EF]' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginMode(false); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isLoginMode ? 'bg-white text-[#2563EB] shadow-sm border border-[#DCE3EF]' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 px-3.5 py-3 mb-4 rounded-xl bg-crimsonsoft-50 border border-crimsonsoft-200 text-crimsonsoft-700 text-xs">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Forms */}
          <form onSubmit={isLoginMode ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">

            {!isLoginMode && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                    />
                  </div>
                </div>

                {/* Role Title & Dept */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="role_title"
                        value={formData.role_title}
                        onChange={handleChange}
                        placeholder="e.g. Director"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="e.g. NSSO"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Zone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Zone</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      name="zone"
                      value={formData.zone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all appearance-none cursor-pointer"
                    >
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Email / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@mospi.gov.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-[#DCE3EF] text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2563EB] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold transition-all duration-200 shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 flex items-center justify-center space-x-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isLoginMode ? 'Authenticating…' : 'Creating Profile…'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoginMode ? 'Sign In to Portal' : 'Enter Secure Portal'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-slate-400 font-medium">
            Secured by MoSPI · iGOT Karmayogi Official System
          </p>
        </div>
      </div>
    </div>
  );
}
