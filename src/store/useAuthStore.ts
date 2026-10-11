// Store de autenticación (zustand): espejo reactivo de la sesión única de la app
// (Supabase cuando hay un proyecto conectado; si no, cuenta demo en este navegador).
import { create } from 'zustand';
import {
  signIn as sessionSignIn,
  signUp as sessionSignUp,
  signOut as sessionSignOut,
  useSession,
  type SessionUser,
  type SignUpResult,
} from '../lib/session';

interface AuthState {
  signIn: (email: string, password: string) => Promise<SessionUser>;
  signUp: (email: string, password: string, name?: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

// Las acciones delegan en lib/session, que persiste la sesión y notifica a la app.
export const useAuthStore = create<AuthState>(() => ({
  signIn: (email, password) => sessionSignIn(email, password),
  signUp: (email, password, name) => sessionSignUp(email, password, name),
  signOut: () => sessionSignOut(),
}));

// Hook combinado: estado de sesión (usuario, carga, modo demo) + acciones del store.
export function useAuth() {
  const session = useSession();
  const { signIn, signUp, signOut } = useAuthStore();
  return { ...session, signIn, signUp, signOut };
}
