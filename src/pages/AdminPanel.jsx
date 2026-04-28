import { useParkingSummary } from '../hooks/useParkingSummary'

const cardClass = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm'

export function AdminPanel() {
  const summary = useParkingSummary()

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold text-slate-900">Panel administrativo</h2>
      <p className="mt-1 text-slate-600">Resumen rapido del estado de parqueos.</p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Total ubicaciones</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{summary.total}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Disponibles</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{summary.available}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Con pocos espacios</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{summary.few}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Llenos</p>
          <p className="mt-1 text-3xl font-bold text-rose-600">{summary.full}</p>
        </article>
      </section>
    </main>
  )
}
