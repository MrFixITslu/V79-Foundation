import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { X, Shield, Lock, Mail, User as UserIcon } from 'lucide-react';
import { Role } from '../types.js';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, verifyMfa, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('donor');
  
  // MFA login states
  const [mfaRequiredEmail, setMfaRequiredEmail] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(email, password);
      if (res && res.mfaRequired) {
        setMfaRequiredEmail(res.email);
        return; // Stay open, wait for MFA code
      }
    } else {
      await register(name, email, password, role);
    }
    // Only close if we didn't trigger an MFA challenge
    if (!mfaRequiredEmail) {
      closeAuthModal();
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaRequiredEmail && mfaCode) {
      const success = await verifyMfa(mfaRequiredEmail, mfaCode);
      if (success) {
        setMfaRequiredEmail(null);
        setMfaCode('');
      }
    }
  };

  const quickLogins: { label: string; email: string; role: Role; color: string }[] = [
    { label: 'Admin Director', email: 'admin@vision79.org', role: 'admin', color: 'bg-purple-600' },
    { label: 'Field Volunteer', email: 'volunteer@vision79.org', role: 'volunteer', color: 'bg-emerald-600' },
    { label: 'Corporate Partner', email: 'sponsor@acme.org', role: 'sponsor', color: 'bg-amber-600' },
    { label: 'Individual Donor', email: 'donor@example.org', role: 'donor', color: 'bg-blue-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {mfaRequiredEmail ? 'Mandatory Two-Factor Authentication' : mode === 'login' ? 'Welcome Back to Vision79' : 'Create Vision79 Account'}
          </h3>
          <p className="text-xs text-slate-500">
            {mfaRequiredEmail ? 'Your identity must be cryptographically verified' : 'Access your donor history, volunteer logs, or admin hub.'}
          </p>
        </div>

        {mfaRequiredEmail ? (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-400">
              <span className="font-extrabold block mb-1">🛡️ Two-Factor Verification Required</span>
              An MFA prompt has been issued for <strong>{mfaRequiredEmail}</strong>. Please provide the 6-digit verification code from your authenticator application to proceed.
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">6-Digit Security Token</label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Verify Token & Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMfaRequiredEmail(null);
                setMfaCode('');
              }}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center font-bold cursor-pointer"
            >
              Return to Password Sign In
            </button>
          </form>
        ) : (
          <>
            {/* Quick Demo Accounts */}
            <div className="space-y-2 mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Quick One-Click Test Accounts
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickLogins.map((q) => (
                  <button
                    key={q.email}
                    type="button"
                    onClick={async () => {
                      const res = await login(q.email, 'password123');
                      if (res && res.mfaRequired) {
                        setMfaRequiredEmail(res.email);
                      } else {
                        closeAuthModal();
                      }
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 border text-left text-xs font-bold transition-all cursor-pointer"
                  >
                    <div className="text-slate-900 dark:text-white text-[11px] truncate">{q.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{q.email}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@vision79.org"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-900 dark:text-white"
                  >
                    <option value="donor">Individual Supporter / Donor</option>
                    <option value="volunteer">Field Volunteer</option>
                    <option value="sponsor">Corporate Sponsor Partner</option>
                    <option value="beneficiary">Community Member / Beneficiary</option>
                    <option value="admin">Admin Director</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md mt-2 cursor-pointer"
              >
                {mode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button onClick={() => setMode('login')} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
