import { useEffect, useMemo, useState } from 'react'

const TIME_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function ReservationsPanel({
  isOpen,
  reservations,
  parkings,
  onClose,
  onCancel,
  onClearHistory,
}) {
  const [pendingCancelId, setPendingCancelId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  const activeReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'active'),
    [reservations],
  )
  const cancelledReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'cancelled'),
    [reservations],
  )

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2800)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  useEffect(() => {
    if (!isOpen) {
      setPendingCancelId(null)
    }
  }, [isOpen])

  const pendingReservation = activeReservations.find((reservation) => reservation.id === pendingCancelId) ?? null

  const confirmCancel = () => {
    if (!pendingCancelId) {
      return
    }

    onCancel(pendingCancelId)
    setToastMessage('Reserva cancelada. El espacio fue liberado.')
    setPendingCancelId(null)
  }

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Cerrar reservas"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Mis Reservas</h3>
            <p className="text-sm text-slate-500">Reservas activas en tu sesión actual</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-3">
          {pendingReservation ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <p className="font-semibold text-amber-900">
                ¿Estás seguro? El espacio quedará disponible para otros conductores.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={confirmCancel}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  Sí, cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setPendingCancelId(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Volver
                </button>
              </div>
            </div>
          ) : null}

          {activeReservations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
              No tenés reservas activas.
            </div>
          ) : null}

          {activeReservations.map((reservation) => {
            const parking = parkings.find((currentParking) => currentParking.id === reservation.parkingId)

            return (
              <article key={reservation.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{parking?.name ?? 'Parqueo no encontrado'}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      Espacio #{reservation.spaceNumber} · {TIME_FORMATTER.format(new Date(reservation.timestamp))}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPendingCancelId(reservation.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Cancelar reserva
                  </button>
                </div>
              </article>
            )
          })}

          <div className="pt-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold uppercase tracking-wide text-slate-500">Historial</h4>
              <button
                type="button"
                onClick={onClearHistory}
                className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Limpiar historial
              </button>
            </div>

            <div className="space-y-3">
              {cancelledReservations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No hay reservas canceladas.
                </div>
              ) : null}

              {cancelledReservations.map((reservation) => {
                const parking = parkings.find((currentParking) => currentParking.id === reservation.parkingId)

                return (
                  <article
                    key={reservation.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-500 shadow-sm"
                  >
                    <h4 className="font-semibold line-through">{parking?.name ?? 'Parqueo no encontrado'}</h4>
                    <p className="mt-1 text-sm line-through">
                      Espacio #{reservation.spaceNumber} · {TIME_FORMATTER.format(new Date(reservation.timestamp))}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        {toastMessage ? (
          <div className="fixed bottom-6 right-6 z-[60] rounded-2xl border border-emerald-200 bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-xl">
            {toastMessage}
          </div>
        ) : null}
      </aside>
    </div>
  )
}
