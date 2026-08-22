/**
 * useAuth – convenience re-export of the AuthContext hook.
 * Import from here instead of the context directly for cleaner component code.
 *
 * Usage:
 *   import { useAuth } from '../hooks/useAuth';
 *   const { user, displayName, avatarUrl, signIn, signOut } = useAuth();
 */
export { useAuth } from '../context/AuthContext';
