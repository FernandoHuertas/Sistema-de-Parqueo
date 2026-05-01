import { useEffect, useState } from 'react'

const INITIAL_FORM = {
  name: '',
  address: '',
  totalSpaces: 1,
  pricePerHour: 0,
  operatingHours: '',
}

export function AddMunicipalZoneModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState(INITIAL_FORM)

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onCreate({
      name: formData.name.trim(),
      address: formData.address.trim(),
      totalSpaces: Number(formData.totalSpaces),
      pricePerHour: Number(formData.pricePerHour),
      operatingHours: formData.operatingHours.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Agregar zona de vía pública</h3>
            <p className="mt-1 text-sm text-slate-500">Alta de una nueva zona municipal visible para todos.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Nombre de la zona
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Referencia de calle
            <input
              type="text"
              required
              value={formData.address}
              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Número de espacios
            <input
              type="number"
              min="1"
              required
              value={formData.totalSpaces}
              onChange={(event) => setFormData({ ...formData, totalSpaces: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Precio por hora
            <input
              type="number"
              min="0"
              required
              value={formData.pricePerHour}
              onChange={(event) => setFormData({ ...formData, pricePerHour: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Horario operativo
            <input
              type="text"
              required
              value={formData.operatingHours}
              onChange={(event) => setFormData({ ...formData, operatingHours: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Agregar zona
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
