import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  ArrowLeftRight,
  Wallet,
  Target,
  Landmark,
  TrendingUp,
  CreditCard,
  LineChart,
  Settings,
  LogOut,
  Moon,
  Sun,
  Accessibility,
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useSession, signOut } from '../lib/session';
import { useTheme } from '../lib/theme';
import { useEasyModeStore } from '../store/useEasyModeStore';

type NavItem = {
  to: string | null;
  label: string;
  icon: typeof Home;
  soon: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: '/app', label: 'Panel', icon: Home, soon: false },
  { to: null, label: 'Movimientos', icon: ArrowLeftRight, soon: true },
  { to: null, label: 'Presupuestos', icon: Wallet, soon: true },
  { to: null, label: 'Metas', icon: Target, soon: true },
  { to: null, label: 'Cuentas', icon: Landmark, soon: true },
  { to: null, label: 'Patrimonio', icon: TrendingUp, soon: true },
  { to: null, label: 'Deudas', icon: CreditCard, soon: true },
  { to: null, label: 'Inversiones', icon: LineChart, soon: true },
  { to: null, label: 'Configuración', icon: Settings, soon: true },
];

// Destinos principales de la barra inferior en celular (máx. 5).
const BOTTOM_ITEMS: NavItem[] = [
  { to: '/app', label: 'Panel', icon: Home, soon: false },
  { to: null, label: 'Movimientos', icon: ArrowLeftRight, soon: true },
  { to: null, label: 'Presupuestos', icon: Wallet, soon: true },
  { to: null, label: 'Metas', icon: Target, soon: true },
  { to: null, label: 'Cuentas', icon: Landmark, soon: true },
];

function SoonBadge() {
  return (
    <span className="rounded-full border border-[#D9E0EC] bg-[#F5F7FB] px-2 py-0.5 text-[12px] font-semibold text-[#5C677D] dark:border-[#33405A] dark:bg-[#101522] dark:text-[#B4BED0]">
      Próximamente
    </span>
  );
}

function SideNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.soon || !item.to) {
    return (
      <button
        type="button"
        title={`${item.label}: próximamente`}
        aria-disabled="true"
        onClick={() => toast.info(`«${item.label}» llegará en una próxima etapa.`)}
        className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-[#5C677D] transition-colors hover:bg-[#F5F7FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] dark:text-[#B4BED0] dark:hover:bg-[#101522]"
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{item.label}</span>
        <SoonBadge />
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        clsx(
          'flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]',
          isActive
            ? 'bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-[#111827]'
            : 'text-[#5C677D] hover:bg-[#F5F7FB] dark:text-[#B4BED0] dark:hover:bg-[#101522]',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate">{item.label}</span>
    </NavLink>
  );
}

function BottomNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  if (item.soon || !item.to) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-label={`${item.label}, próximamente`}
        onClick={() => toast.info(`«${item.label}» llegará en una próxima etapa.`)}
        className="flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[12px] font-medium text-[#5C677D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] dark:text-[#B4BED0]"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className="max-w-full truncate">{item.label}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={item.to}
      end
      className={({ isActive }) =>
        clsx(
          'flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-lg text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]',
          isActive
            ? 'font-semibold text-[#4F46E5] dark:text-[#818CF8]'
            : 'font-medium text-[#5C677D] dark:text-[#B4BED0]',
        )
      }
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="max-w-full truncate">{item.label}</span>
    </NavLink>
  );
}

export default function FinanceLayout() {
  const { user, demo } = useSession();
  const { isDark, toggle: toggleTheme } = useTheme();
  const easyMode = useEasyModeStore((state) => state.easyMode);
  const toggleEasyMode = useEasyModeStore((state) => state.toggle);
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    // El modo accesible aumenta el tamaño base de la tipografía del panel.
    const root = document.documentElement;
    root.classList.toggle('easy-mode', easyMode);
    return () => root.classList.remove('easy-mode');
  }, [easyMode]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      toast.success('Sesión cerrada. Hasta la próxima.');
      navigate('/login', { replace: true });
    } catch {
      setSigningOut(false);
      toast.error('No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  };

  const firstName = user?.name?.trim().split(' ')[0] ?? '';

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] font-sans text-[#172033] dark:bg-[#101522] dark:text-[#F3F6FC]">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-[#4F46E5] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      {/* Barra lateral (escritorio) */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[#D9E0EC] bg-white md:flex dark:border-[#33405A] dark:bg-[#182033]">
        <div className="flex items-center gap-3 px-6 py-5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4F46E5] text-white dark:bg-[#818CF8] dark:text-[#111827]"
          >
            <Wallet className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">Panel NidoApp</span>
        </div>

        <nav aria-label="Secciones del panel" className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV_ITEMS.map((item) => (
            <SideNavLink key={item.label} item={item} />
          ))}
        </nav>

        <div className="border-t border-[#D9E0EC] p-3 dark:border-[#33405A]">
          {demo && (
            <p className="mb-2 rounded-lg bg-[#F5F7FB] px-3 py-2 text-[12px] leading-5 text-[#5C677D] dark:bg-[#101522] dark:text-[#B4BED0]">
              Modo demo: tu cuenta vive solo en este navegador.
            </p>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#B91C1C] transition-colors hover:bg-[#F5F7FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] disabled:opacity-60 dark:hover:bg-[#101522]"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            {signingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      {/* Columna principal */}
      <div className={clsx('flex min-w-0 flex-1 flex-col', easyMode && 'text-base')}>
        <header className="sticky top-0 z-40 border-b border-[#D9E0EC] bg-[#F5F7FB]/85 backdrop-blur dark:border-[#33405A] dark:bg-[#101522]/85">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-white md:hidden dark:bg-[#818CF8] dark:text-[#111827]"
            >
              <Wallet className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base font-bold leading-tight sm:text-xl">
                {firstName ? `Hola, ${firstName}` : 'Panel NidoApp'}
              </p>
              <p className="truncate text-[12px] text-[#5C677D] sm:text-sm dark:text-[#B4BED0]">
                Tu dinero, claro y tranquilo.
              </p>
            </div>

            <button
              type="button"
              onClick={toggleEasyMode}
              aria-pressed={easyMode}
              title={easyMode ? 'Desactivar modo accesible' : 'Activar modo accesible'}
              className={clsx(
                'flex min-h-[44px] items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]',
                easyMode
                  ? 'border-[#4F46E5] bg-[#4F46E5] text-white dark:border-[#818CF8] dark:bg-[#818CF8] dark:text-[#111827]'
                  : 'border-[#D9E0EC] bg-white text-[#172033] hover:bg-[#F5F7FB] dark:border-[#33405A] dark:bg-[#182033] dark:text-[#F3F6FC] dark:hover:bg-[#101522]',
              )}
            >
              <Accessibility className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Modo accesible</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-lg border border-[#D9E0EC] bg-white text-[#172033] transition-colors hover:bg-[#F5F7FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] dark:border-[#33405A] dark:bg-[#182033] dark:text-[#F3F6FC] dark:hover:bg-[#101522]"
            >
              {isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex h-[44px] w-[44px] items-center justify-center rounded-lg border border-[#D9E0EC] bg-white text-[#B91C1C] transition-colors hover:bg-[#F5F7FB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] disabled:opacity-60 md:hidden dark:border-[#33405A] dark:bg-[#182033] dark:hover:bg-[#101522]"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main
          id="contenido"
          className={clsx(
            'mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-28 sm:px-6 md:pb-8',
            easyMode ? 'text-base' : 'text-sm',
          )}
        >
          <Outlet />
        </main>
      </div>

      {/* Barra inferior (celular) */}
      <nav
        aria-label="Secciones principales"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#D9E0EC] bg-white/95 backdrop-blur md:hidden dark:border-[#33405A] dark:bg-[#182033]/95"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-stretch gap-1 px-2 py-1.5">
          {BOTTOM_ITEMS.map((item) => (
            <BottomNavLink key={item.label} item={item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
