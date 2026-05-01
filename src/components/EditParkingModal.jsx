import { useEffect, useState } from 'react'

export function EditParkingModal({ parking, onClose, onSave }) {
  const [formData, setFormData] = useState(parking)

  useEffect(() => {
    setFormData(parking)
  }, [parking])

  if (!parking) {
    return null
  }

  const handleChange = (field, value) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({
      ...formData,
      availableSpaces: Number(formData.availableSpaces),
      pricePerHour: Number(formData.pricePerHour),
      promotionText: formData.promotionText?.trim() ? formData.promotionText : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Editar parqueo</h3>
            <p className="mt-1 text-sm text-slate-500">{parking.name}</p>
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
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Espacios disponibles
            <input
              type="number"
              min="0"
              max={formData.totalSpaces}
              value={formData.availableSpaces}
              onChange={(event) => handleChange('availableSpaces', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Precio por hora
            <input
              type="number"
              min="0"
              value={formData.pricePerHour}
              onChange={(event) => handleChange('pricePerHour', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              checked={Boolean(formData.hasCover)}
              onChange={(event) => handleChange('hasCover', event.target.checked)}
              className="h-4 w-4"
            />
            Tiene techo
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Horario operativo
            <input
              type="text"
              value={formData.operatingHours}
              onChange={(event) => handleChange('operatingHours', event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Texto promocional
            <textarea
              rows="4"
              value={formData.promotionText ?? ''}
              onChange={(event) => handleChange('promotionText', event.target.value)}
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
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
