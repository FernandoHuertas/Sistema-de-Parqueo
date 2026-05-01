const TIME_FORMATTER = new Intl.DateTimeFormat('es-CR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function ReservationsPanel({ isOpen, reservations, parkings, onClose, onCancel }) {
  const activeReservations = reservations.filter((reservation) => reservation.status === 'active')

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
                    onClick={() => onCancel(reservation.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Cancelar
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
