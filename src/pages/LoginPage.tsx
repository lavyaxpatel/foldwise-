import React, { useState } from 'react';
import { ArrowRight, GraduationCap, KeyRound, LogIn, User, UserPlus } from 'lucide-react';
import { GRADE_LEVELS } from '../data/curriculum';
import { OrigamiSVG } from '../components/OrigamiSVG';
import { useFoldWise } from '../store/useFoldWiseStore';
import type { GradeLevel } from '../types/foldwise';

export const LoginPage: React.FC = () => {
  const { signInAccount, createAccount } = useFoldWise();

  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('Grade 8');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res =
      mode === 'signin'
        ? await signInAccount({ fullName, password })
        : await createAccount({ fullName, password, grade });

    setBusy(false);
    if (!res.ok) {
      setError(res.error || 'Could not enter FoldWise.');
    }
  };

  return (
    <div className="min-h-screen washi-surface flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-6">
        {/* Clean Minimal Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-sm bg-paper/80 border border-charcoal/15 flex items-center justify-center">
            <OrigamiSVG shape="crane" className="w-8 h-8" accent="#C8433A" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-charcoal">FoldWise</h1>
          <p className="text-sm text-charcoal/65">Where learning takes shape.</p>
        </div>

        {/* Simple Sign In / Create Account Card */}
        <div className="paper-card rounded-sm p-6 sm:p-8 space-y-5">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 border-b border-charcoal/15">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`py-2.5 text-sm font-medium border-b-2 transition-colors inline-flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'border-charcoal text-charcoal'
                  : 'border-transparent text-charcoal/55 hover:text-charcoal'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('create');
                setError(null);
              }}
              className={`py-2.5 text-sm font-medium border-b-2 transition-colors inline-flex items-center justify-center gap-1.5 ${
                mode === 'create'
                  ? 'border-charcoal text-charcoal'
                  : 'border-transparent text-charcoal/55 hover:text-charcoal'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-fullname"
                className="block text-xs font-mono uppercase text-charcoal/65 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-fullname"
                  type="text"
                  required
                  minLength={2}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-charcoal/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-mono uppercase text-charcoal/65 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-charcoal/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'create' ? 'Create password (min 4 chars)' : 'Enter password'}
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-charcoal/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
                />
              </div>
            </div>

            {mode === 'create' && (
              <div>
                <label
                  htmlFor="login-grade"
                  className="block text-xs font-mono uppercase text-charcoal/65 mb-1.5"
                >
                  Grade
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-charcoal/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    id="login-grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className="w-full pl-10 pr-4 py-2.5 bg-ivory border border-charcoal/20 rounded-sm text-sm focus:outline-none focus:border-charcoal"
                  >
                    {GRADE_LEVELS.map((g) => (
                      <option key={g} value={g}>
                        {g === 'College' ? 'College / University' : g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-vermilion/15 border border-vermilion/40 rounded-sm text-xs text-vermilion">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 bg-charcoal text-ivory text-sm font-medium rounded-sm hover:bg-vermilion transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {busy
                ? 'Please wait...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Permanent Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-charcoal/60 text-center">
            {mode === 'signin'
              ? 'Your saved Fold XP, grade, and progress load automatically.'
              : 'Your account is saved permanently at 0 XP for future sign-ins.'}
          </p>
        </div>
      </div>
    </div>
  );
};
