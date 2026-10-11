// Datos de ejemplo del panel: saldos, presupuestos y movimientos de demostración.
// Se reemplazarán por datos reales cuando se conecte un proyecto de Supabase.

export interface DemoMovement {
  id: string;
  description: string;
  category: string;
  /** Negativo = gasto, positivo = ingreso. */
  amount: number;
  date: string; // ISO
  kind: 'income' | 'expense';
}

export interface DemoBudget {
  id: string;
  name: string;
  spent: number;
  limit: number;
}

export interface DemoSummary {
  monthBalance: number;
  monthIncome: number;
  monthExpenses: number;
  netWorth: number;
}

export const demoSummary: DemoSummary = {
  monthBalance: 1840.5,
  monthIncome: 3200.0,
  monthExpenses: 1359.5,
  netWorth: 26480.75,
};

export const demoBudgets: DemoBudget[] = [
  { id: 'b-1', name: 'Comida', spent: 420, limit: 600 },
  { id: 'b-2', name: 'Transporte', spent: 180, limit: 200 },
  { id: 'b-3', name: 'Ocio', spent: 95, limit: 150 },
  { id: 'b-4', name: 'Hogar', spent: 310, limit: 400 },
];

export const demoMovements: DemoMovement[] = [
  { id: 'm-1', description: 'Sueldo', category: 'Ingresos', amount: 3200, date: '2025-06-01', kind: 'income' },
  { id: 'm-2', description: 'Supermercado', category: 'Comida', amount: -86.4, date: '2025-06-03', kind: 'expense' },
  { id: 'm-3', description: 'Transporte público', category: 'Transporte', amount: -24.5, date: '2025-06-04', kind: 'expense' },
  { id: 'm-4', description: 'Alquiler', category: 'Hogar', amount: -650, date: '2025-06-05', kind: 'expense' },
  { id: 'm-5', description: 'Venta en línea', category: 'Ingresos', amount: 120, date: '2025-06-07', kind: 'income' },
  { id: 'm-6', description: 'Cine y cena', category: 'Ocio', amount: -42.9, date: '2025-06-08', kind: 'expense' },
];

// Formato de moneda en español neutro (USD como referencia de ejemplo).
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-419', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatShortDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat('es-419', { day: 'numeric', month: 'short' }).format(date);
}
