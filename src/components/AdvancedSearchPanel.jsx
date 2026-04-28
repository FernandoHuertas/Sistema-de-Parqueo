const PARKING_TYPES = [
  { value: 'municipal', label: 'Municipal' },
  { value: 'public', label: 'Publico' },
  { value: 'private', label: 'Privado' },
]

export function AdvancedSearchPanel({
  isOpen,
  draftFilters,
  previewCount,
  onClose,
  onApply,
  onClear,
  onChange,
}) {
  const toggleType = (type) => {
    const isSelected = draftFilters.types.includes(type)
    const nextTypes = isSelected
      ? draftFilters.types.filter((currentType) => currentType !== type)
      : [...draftFilters.types, type]

    onChange({ ...draftFilters, types: nextTypes })
  }

  const updateMinPrice = (value) => {
    const minPrice = Number(value)
    const maxPrice = Math.max(minPrice, draftFilters.maxPrice)
    onChange({ ...draftFilters, minPrice, maxPrice })
  }

  const updateMaxPrice = (value) => {
    const maxPrice = Number(value)
    const minPrice = Math.min(draftFilters.minPrice, maxPrice)
    onChange({ ...draftFilters, minPrice, maxPrice })
  }

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}>
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Cerrar panel"
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Busqueda avanzada</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-5">
          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-800">Rango de precio (CRC/hora)</h4>
            <p className="mt-1 text-xs text-slate-500">
              {draftFilters.minPrice} - {draftFilters.maxPrice} CRC
            </p>
            <div className="mt-3 space-y-2">
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={draftFilters.minPrice}
                onChange={(event) => updateMinPrice(event.target.value)}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={draftFilters.maxPrice}
                onChange={(event) => updateMaxPrice(event.target.value)}
                className="w-full"
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={draftFilters.onlyCover}
                onChange={(event) => onChange({ ...draftFilters, onlyCover: event.target.checked })}
                className="h-4 w-4"
              />
              Solo con techo
            </label>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-800">Tipo de parqueo</h4>
            <div className="mt-3 grid gap-2">
              {PARKING_TYPES.map((type) => (
                <label key={type.value} className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draftFilters.types.includes(type.value)}
                    onChange={() => toggleType(type.value)}
                    className="h-4 w-4"
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-800">Estado</h4>
            <div className="mt-3 grid gap-2 text-sm text-slate-700">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="statusFilter"
                  checked={draftFilters.status === 'all'}
                  onChange={() => onChange({ ...draftFilters, status: 'all' })}
                  className="h-4 w-4"
                />
                Todos
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="statusFilter"
                  checked={draftFilters.status === 'available'}
                  onChange={() => onChange({ ...draftFilters, status: 'available' })}
                  className="h-4 w-4"
                />
                Solo disponibles
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="statusFilter"
                  checked={draftFilters.status === 'withSpaces'}
                  onChange={() => onChange({ ...draftFilters, status: 'withSpaces' })}
                  className="h-4 w-4"
                />
                Solo con espacios
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={draftFilters.openNow}
                onChange={(event) => onChange({ ...draftFilters, openNow: event.target.checked })}
                className="h-4 w-4"
              />
              Abierto ahora
            </label>
          </section>
        </div>

        <div className="mt-6 rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {previewCount} resultados coinciden con los filtros actuales
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Limpiar filtros
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Aplicar filtros
          </button>
        </div>
      </aside>
    </div>
  )
}
