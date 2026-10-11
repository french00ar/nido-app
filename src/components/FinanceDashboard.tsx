import { motion } from 'framer-motion';
import {
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import clsx from 'clsx';
import {
  demoBudgets,
  demoMovements,
  demoSummary,
  formatCurrency,
  formatShortDate,
} from '../data/demoData';
import { useSession } from '../lib/session';

const cardClass =
  'rounded-2xl border border-[#D9E0EC] bg-white p-4 shadow-sm sm:p-5 dark:border-[#33405A] dark:bg-[#182033]';

export default function FinanceDashboard() {
  const { demo } = useSession();

  const stats = [
    {
      label: 'Saldo del mes',
      value: demoSummary.monthBalance,
      icon: Wallet,
      accent: 'text-[#4F46E5] dark:text-[#818CF8]',
      bg: 'bg-[#4F46E5]/10 dark:bg-[#818CF8]/15',
    },
    {
      label: 'Ingresos',
      value: demoSummary.monthIncome,
      icon: ArrowUpRight,
      accent: 'text-[#047857] dark:text-emerald-400',
      bg: 'bg-[#047857]/10 dark:bg-emerald-400/15',
    },
    {
      label: 'Gastos',
      value: demoSummary.monthExpenses,
      icon: ArrowDownLeft,
      accent: 'text-[#B91C1C] dark:text-red-400',
      bg: 'bg-[#B91C1C]/10 dark:bg-red-400/15',
    },
    {
      label: 'Patrimonio neto',
      value: demoSummary.netWorth,
      icon: TrendingUp,
      accent: 'text-[#172033] dark:text-[#F3F6FC]',
      bg: 'bg-[#5C677D]/10 dark:bg-[#B4BED0]/15',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      {demo && (
        <p
          role="note"
          className="rounded-2xl border border-[#D9E0EC] bg-white px-4 py-3 text-sm text-[#5C677D] dark:border-[#33405A] dark:bg-[#182033] dark:text-[#B4BED0]"
        >
          Estás viendo <strong className="text-[#172033] dark:text-[#F3F6FC]">datos de ejemplo</strong> del
          modo demo. Los números no son reales y no se guardan fuera de este dispositivo.
        </p>
      )}

      {/* Resumen del mes */}
      <section aria-label="Resumen del mes" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={cardClass}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', stat.bg)}
                >
                  <Icon className={clsx('h-5 w-5', stat.accent)} />
                </span>
                <p className="text-sm font-medium text-[#5C677D] dark:text-[#B4BED0]">{stat.label}</p>
              </div>
              <p className="mt-3 truncate font-display text-2xl font-bold tracking-tight text-[#172033] dark:text-[#F3F6FC]">
                {formatCurrency(stat.value)}
              </p>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Avance de presupuestos */}
        <section aria-labelledby="presupuestos" className={cardClass}>
          <div className="mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5]/10 dark:bg-[#818CF8]/15"
            >
              <PiggyBank className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" />
            </span>
            <h2 id="presupuestos" className="font-display text-lg font-bold text-[#172033] dark:text-[#F3F6FC]">
              Avance de presupuestos
            </h2>
          </div>
          <ul className="space-y-4">
            {demoBudgets.map((budget) => {
              const pct = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
              const nearLimit = pct >= 90;
              return (
                <li key={budget.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-[#172033] dark:text-[#F3F6FC]">
                      {budget.name}
                    </span>
                    <span className="shrink-0 text-sm text-[#5C677D] dark:text-[#B4BED0]">
                      {formatCurrency(budget.spent)} de {formatCurrency(budget.limit)}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${budget.name}: ${pct}% usado`}
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2.5 overflow-hidden rounded-full bg-[#F5F7FB] dark:bg-[#101522]"
                  >
                    <div
                      className={clsx(
                        'h-full rounded-full transition-[width] duration-300',
                        nearLimit ? 'bg-[#B91C1C] dark:bg-red-400' : 'bg-[#4F46E5] dark:bg-[#818CF8]',
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={clsx('mt-1 text-sm', nearLimit ? 'font-semibold text-[#B91C1C] dark:text-red-400' : 'text-[#5C677D] dark:text-[#B4BED0]')}>
                    {nearLimit ? `${pct}% usado: cerca del límite` : `${pct}% usado`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Últimos movimientos */}
        <section aria-labelledby="movimientos" className={cardClass}>
          <div className="mb-4 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4F46E5]/10 dark:bg-[#818CF8]/15"
            >
              <Wallet className="h-5 w-5 text-[#4F46E5] dark:text-[#818CF8]" />
            </span>
            <h2 id="movimientos" className="font-display text-lg font-bold text-[#172033] dark:text-[#F3F6FC]">
              Últimos movimientos
            </h2>
          </div>
          <ul className="divide-y divide-[#D9E0EC] dark:divide-[#33405A]">
            {demoMovements.map((movement) => {
              const income = movement.kind === 'income';
              return (
                <li key={movement.id} className="flex items-center gap-3 py-3">
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                      income
                        ? 'bg-[#047857]/10 text-[#047857] dark:bg-emerald-400/15 dark:text-emerald-400'
                        : 'bg-[#B91C1C]/10 text-[#B91C1C] dark:bg-red-400/15 dark:text-red-400',
                    )}
                  >
                    {income ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#172033] dark:text-[#F3F6FC]" title={movement.description}>
                      {movement.description}
                    </p>
                    <p className="truncate text-sm text-[#5C677D] dark:text-[#B4BED0]">
                      {movement.category} · {formatShortDate(movement.date)}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'shrink-0 text-sm font-bold tabular-nums',
                      income ? 'text-[#047857] dark:text-emerald-400' : 'text-[#B91C1C] dark:text-red-400',
                    )}
                  >
                    {income ? '+' : '−'}
                    {formatCurrency(Math.abs(movement.amount))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </motion.div>
  );
}
