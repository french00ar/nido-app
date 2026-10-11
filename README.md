# Panel NidoApp

## Descripción

# Base de NidoApp: inicio de sesión, panel y menú de navegación ## Qué vas a tener - Una pantalla de **inicio de sesión / crear cuenta** (modo demo: la sesión se guarda solo en este dispositivo, con un aviso visible de que es de prueba).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · PWA

## Estructura

- `/src/App.tsx` — punto de entrada
- `/src/components/LoginScreen.tsx` — Pantalla pública para iniciar sesión o crear una cuenta demo, con aviso visible de que la sesión solo se guarda en este dispositivo.
- `/src/components/FinanceLayout.tsx` — Shell privado del panel con barra lateral en escritorio, barra inferior en celular, encabezado, navegación de accesos futuros y cierre de sesión.
- `/src/components/FinanceDashboard.tsx` — Panel privado con saldo del mes, ingresos, gastos, patrimonio neto, avance de presupuestos, últimos movimientos y el interruptor de modo accesible/fácil. (pendiente: todavía es un marcador)
- `/src/components/CosmosProtectedRoute.tsx` — Parte de control que redirige a /login cuando no existe una sesión demo activa y permite acceder al panel cuando sí existe.

## Instalación

```bash
npm install
npm run dev    # desarrollo (Vite)
npm run build  # build de producción → dist/
```

## Variables de entorno

Copia `.env.example` a `.env.local` y completa:

- `VITE_SUPABASE_URL` — URL de tu proyecto Supabase (Settings → API).
- `VITE_SUPABASE_ANON_KEY` — anon/publishable key del mismo proyecto.

Las variables `VITE_*` son públicas en el navegador: **nunca** pongas la `service_role` ni otros secretos aquí.

## Conexión Supabase (manual)

1. Crea (o reutiliza) un proyecto en [supabase.com](https://supabase.com) y copia URL + anon key a `.env.local`.
2. Aplica los SQL de `/supabase/migrations` en orden (SQL Editor del dashboard, o `supabase db push` con la CLI).
3. Si el repo trae `/supabase/functions`, publícalas con `supabase functions deploy <nombre>` (CLI logueada en tu proyecto).
4. Configura los secrets que cada function lea con `Deno.env.get(...)` en Dashboard → Edge Functions → Secrets.

## Deploy en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com) (framework: Vite).
2. Build command `npm run build`, output `dist/`.
3. Carga las variables `VITE_*` de `.env.example` en Settings → Environment Variables.
4. En Supabase → Auth → URL Configuration agrega el dominio de Vercel a los redirects si tu app usa login.

## Integración continua

El workflow `.github/workflows/cosmos-build.yml` valida el build en cada push y, si falta `package-lock.json`, lo genera y propone un PR con el lockfile.

## Navegación

SPA con React Router y fallback de navegación para publicación.

---

_Generado con Cosmos Code_
