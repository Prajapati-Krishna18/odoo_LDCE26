import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const extractName = (user) => {
  if (!user) return { firstName: '', lastName: '', fullName: '' };
  const meta = user.user_metadata || {};
  // Google / OAuth provides full_name or name
  const full = meta.full_name || meta.name || '';
  const parts = full.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName, fullName: full };
};

const extractAvatar = (user) => {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return meta.avatar_url || meta.picture || null;
};

const mapProfile = (dbUser) => {
  if (!dbUser) return null;
  return {
    ...dbUser,
    full_name: dbUser.name,
    avatar_url: dbUser.profile_image,
  };
};

const upsertProfile = async (user) => {
  if (!user) return null;
  const { firstName, fullName } = extractName(user);
  const avatar = extractAvatar(user);

  // Check if profile exists
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 = no rows found — that's expected for new users
    // Any other error (e.g. 400 bad API key, 401, network) — log it clearly
    console.error('[GlobeTrotter] upsertProfile fetch error:', fetchError.code, fetchError.message);
  }

  if (existingUser) {
    return mapProfile(existingUser);
  }

  // If not, insert a new record
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: user.id,
      name: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Traveller',
      email: user.email || '',
      password: '', // placeholder — auth handled by Supabase Auth
      profile_image: avatar || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[GlobeTrotter] upsertProfile insert error:', error.code, error.message, error.details);
    return null;
  }
  return mapProfile(data);
};


// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const initDone = useRef(false);

  useEffect(() => {
    // 1. Restore existing session on mount
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        if (s?.access_token) {
          localStorage.setItem('token', s.access_token);
        }
        const p = await upsertProfile(s.user);
        setProfile(p);
      } else {
        localStorage.removeItem('token');
      }
      setLoading(false);
      initDone.current = true;
    });

    // 2. Listen for auth state changes (login, logout, token refresh, OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        // Skip the initial SIGNED_IN that fires right after getSession
        if (!initDone.current && event === 'INITIAL_SESSION') return;

        setSession(s);
        setUser(s?.user ?? null);

        if (s?.user) {
          if (s?.access_token) {
            localStorage.setItem('token', s.access_token);
          }
          const p = await upsertProfile(s.user);
          setProfile(p);
        } else {
          setProfile(null);
          localStorage.removeItem('token');
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth Methods ────────────────────────────────────────────────────────────

  /** Email + Password Sign In */
  const signIn = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  /** Alias kept for backward compat with Login.jsx */
  const login = signIn;

  /** Email + Password Sign Up */
  const signUp = async (name, email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        // If Supabase email confirmation is OFF, user lands on dashboard.
        // If ON, Supabase sends confirm email – we show a message instead.
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setLoading(false);
    if (error) return { success: false, error: error.message };

    // session is null when email confirmation is required
    const needsConfirm = !data.session;
    return { success: true, needsConfirm, data };
  };

  /** Alias kept for backward compat with Signup.jsx */
  const signup = (name, email, password) => signUp(name, email, password);

  /** Google OAuth */
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  /** Send password reset email */
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  /** Update password (called from /reset-password page after redirect) */
  const resetPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  /** Sign Out */
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  /** Alias kept for backward compat with MainLayout.jsx */
  const logout = signOut;

  /** Update profile fields */
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    // Map updates to match the DB columns
    const dbUpdates = {};
    if (updates.full_name !== undefined) dbUpdates.name = updates.full_name;
    if (updates.language !== undefined) dbUpdates.language = updates.language;
    if (updates.avatar_url !== undefined) dbUpdates.profile_image = updates.avatar_url;
    if (updates.role !== undefined) dbUpdates.role = updates.role;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    
    const mappedProfile = mapProfile(data);
    setProfile(mappedProfile);
    return { success: true, data: mappedProfile };
  };

  /** Backward compat alias */
  const updatePreferences = (u) => setProfile(u);

  // ── Derived display values ───────────────────────────────────────────────────
  const { firstName, lastName, fullName } = extractName(user);
  const avatarUrl = profile?.avatar_url || extractAvatar(user);
  const displayName = profile?.full_name || fullName || user?.email?.split('@')[0] || 'Traveller';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // ── Context value ────────────────────────────────────────────────────────────
  const value = {
    // State
    user,
    session,
    profile,
    loading,
    isAuthenticated: !!user,
    // Display helpers
    displayName,
    firstName,
    lastName,
    fullName,
    avatarUrl,
    initials,
    // Auth methods
    signIn,
    login,           // compat
    signUp,
    signup,          // compat
    signInWithGoogle,
    signOut,
    logout,          // compat
    forgotPassword,
    resetPassword,
    updateProfile,
    updatePreferences, // compat
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#FDE6D5] border-t-[#C2410C] animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-xl">🏔️</span>
            </div>
            <p className="text-sm text-[#92400E] font-semibold animate-pulse">
              Loading GlobeTrotter...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
