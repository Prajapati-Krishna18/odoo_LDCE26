import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login, signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();
  const submitting = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect already-authenticated users
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errs.email = 'Email is required.';
    else if (!emailRegex.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (submitting.current) return; // guard duplicate clicks
    submitting.current = true;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    submitting.current = false;

    if (result.success) {
      toastSuccess('Welcome back to GlobeTrotter! 🌏');
      navigate('/dashboard');
    } else {
      // Map Supabase error messages to friendly text
      let msg = result.error || 'Login failed. Please try again.';
      if (msg.includes('Invalid login credentials')) msg = 'Incorrect email or password.';
      if (msg.includes('Email not confirmed')) msg = 'Please confirm your email before logging in.';
      toastError(msg);
    }
  };

  const handleGoogleLogin = async () => {
    if (submitting.current) return;
    submitting.current = true;
    toastInfo('Redirecting to Google Sign-In...');
    const result = await signInWithGoogle();
    submitting.current = false;
    if (!result.success) {
      toastError(result.error || 'Google login failed. Please try again.');
    }
    // On success, Supabase redirects the browser — no further action needed.
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Column - Image Showcase */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Indian Heritage"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />
        <svg className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,70 Q25,80 50,65 T100,20" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="1 1" />
          <circle cx="20" cy="72" r="0.8" fill="white" />
          <circle cx="80" cy="40" r="0.8" fill="white" />
        </svg>
        <div className="absolute bottom-16 left-12 right-12 z-10 text-white pr-12">
          <h1 className="text-5xl font-serif font-bold mb-4 leading-tight tracking-tight shadow-sm">
            Discover India's Heritage
          </h1>
          <p className="text-lg text-slate-100 font-medium">
            Your premium concierge for curating unforgettable journeys across the subcontinent.
          </p>
        </div>
        <div className="absolute top-6 left-6 flex items-center text-white/90 z-10 text-sm font-semibold">
          <span className="text-xl mr-2">🏔️</span>
          GlobeTrotter India
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-[#FFF7ED] p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">

          <h2 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Welcome Back <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h2>
          <p className="text-[#64748B] text-sm mt-2 mb-8">
            Sign in to access your planned trips.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                placeholder="name@example.com"
                className={`w-full px-4 py-3 bg-[#FFF7ED]/50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors text-[#0F172A] placeholder-slate-400 ${
                  errors.email ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-[#F97316]/20 focus:border-[#F97316]'
                }`}
              />
              {errors.email && <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#D05114] hover:text-[#F97316] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-[#FFF7ED]/50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors text-[#0F172A] placeholder-slate-400 pr-10 ${
                    errors.password ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-[#F97316]/20 focus:border-[#F97316]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1 pb-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#D05114] border-slate-300 rounded focus:ring-[#D05114] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-[#64748B] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C2410C] hover:bg-[#9A3412] text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#C2410C]/20 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-100" />
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-slate-100" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-[#0F172A] py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 cursor-pointer hover:border-slate-300 hover:shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </button>

            {/* Signup Link */}
            <p className="text-center text-xs text-[#64748B] mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#C2410C] font-bold hover:underline underline-offset-2">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
