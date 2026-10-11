# Finanzas Personales

## Descripción

# Plan de construcción — Mini App de Finanzas Personales Este mini app conviene construirlo por etapas. Pega un prompt por vez en el mismo proyecto de Cosmos Code y revisa el resultado antes de enviar el siguiente. PROMPT 1 — BASE DEL APP Quiero una mini app de finanzas personales para alguien que quiere dejar de usar planillas y ordenar sus ingresos y gastos.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · PWA

## Estructura

- `/src/App.tsx` — punto de entrada
- `/src/components/LoginScreen.tsx` — Permite iniciar sesión o crear una cuenta para proteger los datos financieros personales.
- `/src/components/FinanceLayout.tsx` — Envuelve las pantallas privadas con navegación lateral en escritorio, navegación inferior en móvil, encabezado y acceso a configuración.
- `/src/components/FinanceDashboard.tsx` — Muestra el saldo del mes, ingresos, gastos, patrimonio neto, avances de presupuestos y los últimos movimientos en la moneda principal.
- `/src/components/MovementsScreen.tsx` — Lista, filtra y busca ingresos y gastos del usuario por fecha, tipo, categoría y cuenta.
- `/src/components/MovementFormScreen.tsx` — Permite crear y editar movimientos de ingreso o gasto con monto, categoría, fecha, cuenta, descripción y moneda.
- `/src/components/BudgetsScreen.tsx` — Permite definir presupuestos mensuales por categoría y muestra lo gastado, lo disponible y el porcentaje utilizado.
- `/src/components/BudgetFormScreen.tsx` — Permite crear y editar un presupuesto mensual asociado a una categoría y un límite de gasto.
- `/src/components/GoalsScreen.tsx` — Muestra las metas financieras con monto objetivo, ahorro acumulado, fecha límite y progreso visual.
- `/src/components/GoalFormScreen.tsx` — Permite crear y editar una meta financiera con nombre, monto objetivo, monto ahorrado y fecha límite.
- `/src/components/AccountsScreen.tsx` — Lista las cuentas de efectivo, banco, tarjeta u otros medios y muestra el saldo de cada una.
- `/src/components/AccountFormScreen.tsx` — Permite crear y editar cuentas con tipo, nombre y saldo actual.
- `/src/components/NetWorthScreen.tsx` — Presenta el portafolio como cuentas más inversiones menos deudas, con totales convertidos a la moneda principal.
- `/src/components/DebtsScreen.tsx` — Lista y resume los gastos registrados en la moneda principal del usuario.
- `/src/components/DebtFormScreen.tsx` — Permite crear y editar un gasto con nombre, monto pendiente, fecha límite y estado.
- `/src/components/InvestmentsScreen.tsx` — Lista inversiones con su moneda original, valor actual y valor convertido a la moneda principal mediante tasas manuales.
- `/src/components/InvestmentFormScreen.tsx` — Permite crear y editar inversiones con nombre, valor, moneda propia, tasa de conversión manual y fecha de valoración.
- `/src/components/SettingsScreen.tsx` — Permite elegir la moneda principal, configurar tasas manuales de referencia, editar categorías y administrar preferencias de la cuenta, incluido el modo accesible.
- `/src/store/useEasyModeStore.ts` — Estado global del modo fácil/accesible con Zustand y persistencia en localStorage; es la única fuente de verdad que comparten el panel y Configuración.
- `/src/components/FinancialAnalysisScreen.tsx` — Muestra una sección preparada para activar posteriormente el análisis financiero con IA, explicando que revisará movimientos, presupuestos, metas, cuentas, deudas e inversiones cuando se configure la integración.

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
