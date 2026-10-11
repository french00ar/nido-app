import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '../lib/session';

/**
 * Guardia de rutas privadas de Panel NidoApp.
 * Redirige a /login cuando no existe una sesión activa
 * (recordando la ruta de origen para volver después del inicio
 * de sesión) y permite el acceso al panel cuando sí existe.
 */
export default function CosmosProtectedRoute() {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 dark:bg-[#101522]"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="h-8 w-8 animate-spin rounded-full border-4 border-[#D9E0EC] border-t-[#4F46E5] motion-reduce:animate-none dark:border-[#33405A] dark:border-t-[#818CF8]"
            aria-hidden="true"
          />
          <p className="text-sm text-[#5C677D] dark:text-[#B4BED0]">
            Cargando tu sesión…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <Outlet />;
}
