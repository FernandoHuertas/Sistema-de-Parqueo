import { useParkingContext } from '../context/ParkingContext'
import { getStatus } from '../data/mockData'

const statusClasses = {
  available: 'bg-emerald-100 text-emerald-700',
  few: 'bg-amber-100 text-amber-700',
  full: 'bg-rose-100 text-rose-700',
}

const typeClasses = {
  municipal: 'bg-blue-100 text-blue-700',
  public: 'bg-orange-100 text-orange-700',
  private: 'bg-slate-200 text-slate-700',
}

const typeLabels = {
  municipal: 'Municipal',
  public: 'Publico',
  private: 'Privado',
}

export function ClientMapView() {
  const { parkings } = useParkingContext()

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold text-slate-900">Mapa de parqueos</h2>
      <p className="mt-1 text-slate-600">
        Datos mock para visualizacion de disponibilidad en Ciudad Quesada.
      </p>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {parkings.map((parking) => {
          const status = getStatus(parking)

          return (
            <article key={parking.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{parking.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${typeClasses[parking.type]}`}>
                    {typeLabels[parking.type]}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClasses[status]}`}>
                    {status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600">{parking.address}</p>
              <p className="mt-2 text-sm text-slate-700">Tipo: {parking.type}</p>
              <p className="text-sm text-slate-700">
                Espacios: {parking.availableSpaces}/{parking.totalSpaces}
              </p>
              <p className="text-sm text-slate-700">Tarifa: {parking.pricePerHour} CRC/hora</p>
            </article>
          )
        })}
      </section>
    </main>
  )
}
