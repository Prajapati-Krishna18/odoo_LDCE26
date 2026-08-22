import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { toastError } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toastError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      toastError(result.error || 'Failed to send reset email. Please try again.');
    }
  };

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
            Reset Your Password
          </h1>
          <p className="text-lg text-slate-100 font-medium">
            We'll send a secure link to your email. Be back exploring in no time.
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

          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#C2410C] transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>

          {!sent ? (
            <>
              <h2 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
                Forgot Password?
              </h2>
              <p className="text-[#64748B] text-sm mt-2 mb-8">
                Enter your account email and we'll send you a reset link.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="reset-email" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#FFF7ED]/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A] placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#C2410C]/20 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Check Your Inbox</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                We've sent a password reset link to{' '}
                <span className="font-bold text-[#0F172A]">{email}</span>.
                <br />
                The link expires in 1 hour.
              </p>
              <p className="text-xs text-[#94A3B8] pt-2">
                Didn't receive it?{' '}
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-[#C2410C] font-bold hover:underline"
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
