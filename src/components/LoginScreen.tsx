import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, Info, Loader2, LogIn, MailCheck, UserPlus, Wallet } from 'lucide-react';
import { useAuth } from '../store/useAuthStore';
import { confirmEmailNotice } from '../lib/session';

// Esquema de validación del formulario de acceso
const loginSchema = z.object({
  email: z.string().min(1, { error: 'Escribe tu correo' }).email({ error: 'Escribe un correo válido' }),
  password: z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres' }),
});

// Esquema de validación del formulario de registro
const registerSchema = loginSchema.extend({
  name: z.string().min(2, { error: 'Escribe tu nombre (mínimo 2 letras)' }),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

type Mode = 'login' | 'register';

function friendlyError(message: string): string {
  if (message === 'invalid_credentials') return 'Correo o contraseña incorrectos.';
  if (message === 'account_exists') return 'Ese correo ya tiene una cuenta. Inicia sesión.';
  return `No se pudo completar la acción: ${message}`;
}

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { demo, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingConfirmationEmail, setPendingConfirmationEmail] = useState<string | null>(null);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onBlur',
  });

  const goToDestination = () => {
    const from = (location.state as { from?: string } | null)?.from;
    const target = from && from.startsWith('/') && !from.startsWith('//') ? from : '/app';
    navigate(target, { replace: true });
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormError(null);
    setShowPassword(false);
  };

  const handleLogin = loginForm.handleSubmit(async (values) => {
    setSending(true);
    setFormError(null);
    try {
      await signIn(values.email, values.password);
      toast.success('Sesión iniciada. Bienvenido a tu panel.');
      goToDestination();
    } catch (err) {
      setFormError(friendlyError(err instanceof Error ? err.message : String(err)));
    } finally {
      setSending(false);
    }
  });

  const handleRegister = registerForm.handleSubmit(async (values) => {
    setSending(true);
    setFormError(null);
    try {
      const result = await signUp(values.email, values.password, values.name);
      if (result.needsConfirmation) {
        // Supabase espera la confirmación por correo: aviso fijo y vuelta al inicio de sesión
        setPendingConfirmationEmail(result.email);
        switchMode('login');
        loginForm.setValue('email', result.email);
      } else {
        toast.success('Cuenta creada. Bienvenido a tu panel.');
        goToDestination();
      }
    } catch (err) {
      setFormError(friendlyError(err instanceof Error ? err.message : String(err)));
    } finally {
      setSending(false);
    }
  });

  const activeForm = mode === 'login' ? loginForm : registerForm;
  const activeEmail = mode === 'login' ? loginForm.watch('email') : registerForm.watch('email');

  const inputClass =
    'w-full rounded-lg border border-[#D9E0EC] bg-white px-4 py-3 text-base text-[#172033] placeholder:text-[#5C677D] focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 dark:border-[#33405A] dark:bg-[#101522] dark:text-[#F3F6FC] dark:placeholder:text-[#B4BED0] dark:focus:border-[#818CF8]';
  const labelClass = 'mb-1 block text-sm font-semibold text-[#172033] dark:text-[#F3F6FC]';
  const errorClass = 'mt-1 text-sm text-[#B91C1C] dark:text-red-400';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-8 dark:bg-[#101522]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Marca */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-[#111827]">
            <Wallet className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[32px] font-bold leading-tight text-[#172033] dark:text-[#F3F6FC]">
            Panel NidoApp
          </h1>
        </div>
        <p className="mb-6 text-center text-base text-[#5C677D] dark:text-[#B4BED0]">
          Entiende tus finanzas con calma. Inicia sesión o crea tu cuenta para entrar al panel.
        </p>

        {/* Aviso de confirmación de correo (fijo en pantalla) */}
        {pendingConfirmationEmail && (
          <div
            role="status"
            className="mb-4 flex items-start gap-3 rounded-2xl border border-[#D9E0EC] bg-white p-4 text-sm text-[#172033] dark:border-[#33405A] dark:bg-[#182033] dark:text-[#F3F6FC]"
          >
            <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#4F46E5] dark:text-[#818CF8]" aria-hidden="true" />
            <p>{confirmEmailNotice(pendingConfirmationEmail)}</p>
          </div>
        )}

        <div className="rounded-2xl border border-[#D9E0EC] bg-white p-6 shadow-sm dark:border-[#33405A] dark:bg-[#182033]">
          {/* Selector de modo */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-[#F5F7FB] p-1 dark:bg-[#101522]" role="tablist" aria-label="Elegir acción">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                mode === 'login'
                  ? 'bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-[#111827]'
                  : 'text-[#5C677D] hover:text-[#172033] dark:text-[#B4BED0] dark:hover:text-[#F3F6FC]'
              }`}
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                mode === 'register'
                  ? 'bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-[#111827]'
                  : 'text-[#5C677D] hover:text-[#172033] dark:text-[#B4BED0] dark:hover:text-[#F3F6FC]'
              }`}
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Crear cuenta
            </button>
          </div>

          {/* Error general del formulario (permanece en pantalla) */}
          {formError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[#B91C1C]/40 bg-[#B91C1C]/5 px-4 py-3 text-sm text-[#B91C1C] dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-400"
            >
              {formError}
            </div>
          )}

          <form
            onSubmit={mode === 'login' ? handleLogin : handleRegister}
            noValidate
            className="space-y-4"
          >
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={inputClass}
                  {...registerForm.register('name')}
                />
                {registerForm.formState.errors.name && (
                  <p className={errorClass}>{registerForm.formState.errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className={labelClass}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                className={inputClass}
                {...activeForm.register('email')}
              />
              {activeForm.formState.errors.email && (
                <p className={errorClass}>{activeForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder="Mínimo 6 caracteres"
                  className={`${inputClass} pr-12`}
                  {...activeForm.register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg text-[#5C677D] hover:text-[#172033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] dark:text-[#B4BED0] dark:hover:text-[#F3F6FC]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
              {activeForm.formState.errors.password && (
                <p className={errorClass}>{activeForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#4338CA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#818CF8] dark:text-[#111827] dark:hover:bg-[#A5B4FC] dark:focus-visible:ring-offset-[#182033]"
            >
              {sending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {sending
                ? 'Un momento…'
                : mode === 'login'
                  ? 'Entrar a mi panel'
                  : 'Crear mi cuenta'}
            </button>
          </form>

          {/* El correo escrito se conserva visible tras un error */}
          {formError && activeEmail && (
            <p className="mt-3 text-center text-sm text-[#5C677D] dark:text-[#B4BED0]">
              Revisa los datos de <span className="font-semibold text-[#172033] dark:text-[#F3F6FC]">{activeEmail}</span> e inténtalo de nuevo.
            </p>
          )}
        </div>

        {/* Aviso de modo demo */}
        <div
          role="note"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-[#D9E0EC] bg-white p-4 text-sm text-[#5C677D] dark:border-[#33405A] dark:bg-[#182033] dark:text-[#B4BED0]"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#4F46E5] dark:text-[#818CF8]" aria-hidden="true" />
          <p>
            {demo
              ? 'Modo demo: tu cuenta y tu sesión se guardan solo en este dispositivo. Es una versión de prueba; para datos reales conecta tu proyecto de Supabase desde Conectores.'
              : 'Tu sesión se gestiona de forma segura con Supabase en este proyecto.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
