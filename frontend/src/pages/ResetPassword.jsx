import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';

const ResetPassword = () => {
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  // Supabase sends tokens as URL hash: #access_token=...&type=recovery
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('access_token')) {
      // The Supabase client auto-processes the hash and sets the session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSessionReady(true);
        } else {
          setInvalidLink(true);
        }
      });
    } else {
      // Also handle PKCE flow where tokens come as query params
      const params = new URLSearchParams(window.location.search);
      if (params.get('code')) {
        supabase.auth.exchangeCodeForSession(params.get('code')).then(({ data, error }) => {
          if (!error && data.session) {
            setSessionReady(true);
          } else {
            setInvalidLink(true);
          }
        });
      } else {
        setInvalidLink(true);
      }
    }
  }, []);

  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = {
      0: { label: 'Very Weak', color: 'bg-rose-500' },
      1: { label: 'Weak', color: 'bg-rose-400' },
      2: { label: 'Fair', color: 'bg-amber-400' },
      3: { label: 'Medium', color: 'bg-yellow-400' },
      4: { label: 'Strong', color: 'bg-emerald-500' },
      5: { label: 'Very Strong', color: 'bg-emerald-600' },
    };
    return { score, ...map[score] };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toastError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      toastError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toastError(error.message || 'Failed to reset password. Please try again.');
    } else {
      toastSuccess('Password updated successfully! Please log in with your new password.');
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  if (invalidLink) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-md border border-slate-100 space-y-5">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Invalid or Expired Link</h2>
          <p className="text-sm text-[#64748B]">
            This password reset link has expired or already been used. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-[#C2410C] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#9A3412] transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (!sessionReady) {
    return (
      <div className="min-h-screen bg-[#FFF7ED] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-[#FDE6D5] border-t-[#C2410C] animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-xl">🏔️</span>
          </div>
          <p className="text-sm text-[#92400E] font-semibold animate-pulse">Verifying link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Heritage"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
        <div className="absolute bottom-16 left-12 right-12 z-10 text-white">
          <h1 className="text-5xl font-serif font-bold mb-4 leading-tight">
            Set a New Password
          </h1>
          <p className="text-lg text-slate-100 font-medium">
            Choose a strong password to keep your account safe.
          </p>
        </div>
        <div className="absolute top-6 left-6 flex items-center text-white/90 z-10 text-sm font-semibold">
          <span className="text-xl mr-2">🏔️</span>
          GlobeTrotter
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-[#FFF7ED] p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FFF7ED] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A]">New Password</h2>
              <p className="text-[#64748B] text-xs">Choose a strong password</p>
            </div>
          </div>

          <form className="space-y-5 mt-8" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-10 bg-[#FFF7ED]/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A] placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-[#FFF7ED]/50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors text-[#0F172A] placeholder-slate-400 ${
                  confirm && confirm !== password
                    ? 'border-rose-300 focus:ring-rose-200 focus:border-rose-400'
                    : 'border-slate-200 focus:ring-[#F97316]/20 focus:border-[#F97316]'
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-[10px] text-rose-500 mt-1 font-semibold">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (confirm && confirm !== password)}
              className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#C2410C]/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
