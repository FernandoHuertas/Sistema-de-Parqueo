import { useMemo, useState } from 'react'
import { AdvancedSearchPanel } from '../components/AdvancedSearchPanel'
import { ParkingDetailModal } from '../components/ParkingDetailModal'
import { PARKING_DATA, getStatus } from '../data/mockData'

const TYPE_LABEL = {
  municipal: 'Municipal',
  public: 'Publico',
  private: 'Privado',
}

const TYPE_BADGE_CLASS = {
  municipal: 'bg-blue-100 text-blue-700',
  public: 'bg-orange-100 text-orange-700',
  private: 'bg-slate-200 text-slate-700',
}

const STATUS_LABEL = {
  available: 'Disponible',
  few: 'Pocos espacios',
  full: 'Lleno',
}

const STATUS_STYLE = {
  available: 'bg-emerald-100 text-emerald-700',
  few: 'bg-amber-100 text-amber-700',
  full: 'bg-rose-100 text-rose-700',
}

const STATUS_ORDER = {
  available: 0,
  few: 1,
  full: 2,
}

const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 5000,
  onlyCover: false,
  types: [],
  status: 'all',
  openNow: false,
}

const CURRENT_HOUR_MOCK = 14

function parseHourTo24(timeText) {
  const [timeValue, period] = timeText.split(' ')
  const [hours, minutes] = timeValue.split(':').map(Number)

  let normalizedHours = hours
  if (period === 'PM' && hours !== 12) {
    normalizedHours += 12
  }
  if (period === 'AM' && hours === 12) {
    normalizedHours = 0
  }

  return normalizedHours + minutes / 60
}

function isOpenNow(parking) {
  if (parking.operatingHours.toLowerCase() === '24 horas') {
    return true
  }

  const [start, end] = parking.operatingHours.split(' - ')
  if (!start || !end) {
    return false
  }

  const startValue = parseHourTo24(start)
  const endValue = parseHourTo24(end)

  return CURRENT_HOUR_MOCK >= startValue && CURRENT_HOUR_MOCK <= endValue
}

function applyFilters(parkings, filters) {
  return parkings.filter((parking) => {
    const status = getStatus(parking)

    if (parking.pricePerHour < filters.minPrice || parking.pricePerHour > filters.maxPrice) {
      return false
    }

    if (filters.onlyCover && !parking.hasCover) {
      return false
    }

    if (filters.types.length > 0 && !filters.types.includes(parking.type)) {
      return false
    }

    if (filters.status === 'available' && status !== 'available') {
      return false
    }

    if (filters.status === 'withSpaces' && parking.availableSpaces <= 0) {
      return false
    }

    if (filters.openNow && !isOpenNow(parking)) {
      return false
    }

    return true
  })
}

function getMockDistance(parking) {
  const numericId = Number(parking.id.replace('p-', ''))
  return Number((numericId * 0.73).toFixed(2))
}

function getQuickSearchSort(a, b) {
  const statusDiff = STATUS_ORDER[getStatus(a)] - STATUS_ORDER[getStatus(b)]
  if (statusDiff !== 0) {
    return statusDiff
  }

  return getMockDistance(a) - getMockDistance(b)
}

function RoofIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5V13h-2v6h-4v-4H9v4H5v-6H3v-1.5Z" />
    </svg>
  )
}

export function ParkingMapView() {
  const [isQuickSearchActive, setIsQuickSearchActive] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [selectedParking, setSelectedParking] = useState(null)
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS)

  const previewCount = useMemo(() => applyFilters(PARKING_DATA, draftFilters).length, [draftFilters])

  const filteredParkings = useMemo(
    () => applyFilters(PARKING_DATA, appliedFilters),
    [appliedFilters],
  )

  const visibleParkings = useMemo(() => {
    if (!isQuickSearchActive) {
      return filteredParkings
    }

    return [...filteredParkings].sort(getQuickSearchSort)
  }, [filteredParkings, isQuickSearchActive])

  const clearAllFilters = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setIsQuickSearchActive(false)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mapa visual de parqueos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Vista tipo grid de ubicaciones en Ciudad Quesada con codigo de colores por estado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQuickSearchActive(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Busqueda rapida
          </button>
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(true)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Filtros avanzados
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {isQuickSearchActive ? (
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Busqueda rapida activa
          </span>
        ) : null}

        {isQuickSearchActive ? (
          <button
            type="button"
            onClick={() => setIsQuickSearchActive(false)}
            className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            X
          </button>
        ) : null}

        <p className="text-sm text-slate-600">
          {visibleParkings.length} parqueos cercanos encontrados
        </p>
      </div>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">Codigo de colores (semaforo):</p>
        <div className="mt-3 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
              ✓
            </span>
            <span className="text-sm text-slate-700">Disponible (&gt; 50% espacios)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
              !
            </span>
            <span className="text-sm text-slate-700">Pocos espacios (10-50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
              ✕
            </span>
            <span className="text-sm text-slate-700">Lleno (&lt; 10%)</span>
          </div>
        </div>
      </section>

      <section className="card-grid mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {visibleParkings.map((parking) => {
          const status = getStatus(parking)

          return (
            <button
              type="button"
              key={parking.id}
              onClick={() => setSelectedParking(parking)}
              className={`animate-slide-up rounded-xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                status === 'full'
                  ? 'border-rose-200 bg-rose-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-slate-900">{parking.name}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${TYPE_BADGE_CLASS[parking.type]}`}>
                  {TYPE_LABEL[parking.type]}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-full text-xs font-bold ${STATUS_STYLE[status]}`}
                >
                  {STATUS_LABEL[status]}
                </span>
                <p className="text-sm font-medium text-slate-700">
                  {parking.availableSpaces}/{parking.totalSpaces} espacios
                </p>
              </div>

              <p className="text-sm text-slate-700">
                <span className="font-semibold">Precio:</span> {parking.pricePerHour} CRC/hora
              </p>

              <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-700">
                <RoofIcon />
                {parking.hasCover ? 'Con techo' : 'Sin techo'}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Horario:</span> {parking.operatingHours}
              </p>
            </button>
          )
        })}
      </section>

      {visibleParkings.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No hay parqueos que coincidan con los filtros seleccionados.
        </div>
      ) : null}

      <AdvancedSearchPanel
        isOpen={isAdvancedOpen}
        draftFilters={draftFilters}
        previewCount={previewCount}
        onChange={setDraftFilters}
        onClose={() => setIsAdvancedOpen(false)}
        onApply={() => {
          setAppliedFilters(draftFilters)
          setIsAdvancedOpen(false)
        }}
        onClear={clearAllFilters}
      />

      {selectedParking ? (
        <ParkingDetailModal parking={selectedParking} onClose={() => setSelectedParking(null)} />
      ) : null}
    </main>
  )
}
