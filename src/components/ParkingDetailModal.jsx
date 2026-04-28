import { useMemo, useState } from 'react'
import { getStatus } from '../data/mockData'

const statusCopy = {
  available: 'Disponible',
  few: 'Pocos espacios',
  full: 'Lleno',
}

const statusClasses = {
  available: 'bg-emerald-100 text-emerald-700',
  few: 'bg-amber-100 text-amber-700',
  full: 'bg-rose-100 text-rose-700',
}

const typeCopy = {
  municipal: 'Municipal',
  public: 'Publico',
  private: 'Privado',
}

function buildGoogleMapsLink(parking) {
  return `https://www.google.com/maps/search/?api=1&query=${parking.lat},${parking.lng}`
}

function buildWazeLink(parking) {
  return `https://waze.com/ul?ll=${parking.lat},${parking.lng}&navigate=yes`
}

export function ParkingDetailModal({ parking, onClose }) {
  const [showDirections, setShowDirections] = useState(false)
  const status = getStatus(parking)

  const squares = useMemo(() => {
    const totalSquares = 20
    const availableSquares = Math.round((parking.availableSpaces / parking.totalSpaces) * totalSquares)

    return Array.from({ length: totalSquares }, (_, index) => index < availableSquares)
  }, [parking.availableSpaces, parking.totalSpaces])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{parking.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{parking.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className={`mb-5 inline-flex rounded-full px-4 py-2 text-sm font-bold ${statusClasses[status]}`}>
          {statusCopy[status]}: {parking.availableSpaces} espacios disponibles de {parking.totalSpaces} totales
        </div>

        <section className="mb-6">
          <p className="mb-2 text-sm font-semibold text-slate-700">Indicador visual de espacios</p>
          <div className="grid grid-cols-10 gap-2 sm:grid-cols-20">
            {squares.map((isAvailable, index) => (
              <div
                key={`${parking.id}-${index}`}
                className={`h-4 rounded-sm ${isAvailable ? 'bg-emerald-500' : 'bg-rose-400'}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />Disponible
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-rose-400" />Ocupado
            </span>
          </div>
        </section>

        <section className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Precio:</span>{' '}
            <span className="text-xl font-bold text-emerald-700">{parking.pricePerHour} CRC/hora</span>
          </p>
          <p>
            <span className="font-semibold">Tipo:</span> {typeCopy[parking.type]}
          </p>
          <p>
            <span className="font-semibold">Techo:</span> {parking.hasCover ? 'Con techo' : 'Sin techo'}
          </p>
          <p>
            <span className="font-semibold">Horario:</span> {parking.operatingHours}
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Reservar espacio
          </button>
          <button
            type="button"
            onClick={() => setShowDirections((value) => !value)}
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Como llegar
          </button>
        </div>

        {showDirections ? (
          <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <a
              href={buildGoogleMapsLink(parking)}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Abrir en Google Maps
            </a>
            <a
              href={buildWazeLink(parking)}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Abrir en Waze
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}
