import { useEffect, useState } from 'react'
import { useParkingContext } from '../context/ParkingContext'

const INITIAL_FORM = {
  name: '',
  address: '',
  lat: '',
  lng: '',
  type: 'public',
  totalSpaces: '1',
  availableSpaces: '0',
  pricePerHour: '',
  hasCover: false,
  operatingHours: '6:00 AM - 10:00 PM',
  promotionText: '',
}

export function AddParkingModal({ isOpen, onClose, onCreated }) {
  const { addParking } = useParkingContext()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM)
      setErrorMessage('')
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const totalSpaces = Number(formData.totalSpaces)
    const availableSpaces = Number(formData.availableSpaces)
    const lat = Number(formData.lat)
    const lng = Number(formData.lng)
    const pricePerHour = Number(formData.pricePerHour)

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      Number.isNaN(totalSpaces) ||
      Number.isNaN(availableSpaces) ||
      Number.isNaN(pricePerHour)
    ) {
      setErrorMessage('Revisá los valores numéricos del formulario.')
      return
    }

    if (totalSpaces < 1) {
      setErrorMessage('El total de espacios debe ser al menos 1.')
      return
    }

    if (availableSpaces < 0 || availableSpaces > totalSpaces) {
      setErrorMessage('Los espacios disponibles deben estar entre 0 y el total de espacios.')
      return
    }

    const nextParking = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      address: formData.address.trim(),
      lat,
      lng,
      type: formData.type,
      totalSpaces,
      availableSpaces,
      pricePerHour,
      hasCover: formData.hasCover,
      operatingHours: formData.operatingHours.trim() || '6:00 AM - 10:00 PM',
      promotionText: formData.promotionText.trim(),
    }

    addParking(nextParking)
    onCreated?.(nextParking)
    onClose()
  }

  const totalSpacesValue = Number(formData.totalSpaces) || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Agregar nuevo parqueo</h3>
            <p className="mt-1 text-sm text-slate-500">Alta rápida para parqueos privados visibles en el panel y el mapa.</p>
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
            Nombre
            <input
              type="text"
              required
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Dirección
            <input
              type="text"
              required
              value={formData.address}
              onChange={(event) => setFormData({ ...formData, address: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Latitud
            <input
              type="number"
              step="any"
              required
              value={formData.lat}
              onChange={(event) => setFormData({ ...formData, lat: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Longitud
            <input
              type="number"
              step="any"
              required
              value={formData.lng}
              onChange={(event) => setFormData({ ...formData, lng: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Tipo
            <select
              required
              value={formData.type}
              onChange={(event) => setFormData({ ...formData, type: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Espacios totales
            <input
              type="number"
              min="1"
              required
              value={formData.totalSpaces}
              onChange={(event) => {
                const nextTotalSpaces = event.target.value
                setFormData((currentForm) => ({
                  ...currentForm,
                  totalSpaces: nextTotalSpaces,
                  availableSpaces:
                    Number(currentForm.availableSpaces) > Number(nextTotalSpaces)
                      ? nextTotalSpaces
                      : currentForm.availableSpaces,
                }))
              }}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Espacios disponibles
            <input
              type="number"
              min="0"
              max={totalSpacesValue}
              required
              value={formData.availableSpaces}
              onChange={(event) => setFormData({ ...formData, availableSpaces: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Precio por hora CRC
            <input
              type="number"
              min="0"
              step="any"
              required
              value={formData.pricePerHour}
              onChange={(event) => setFormData({ ...formData, pricePerHour: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={formData.hasCover}
              onChange={(event) => setFormData({ ...formData, hasCover: event.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            ¿Tiene techo?
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

          <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            Texto de promoción
            <textarea
              rows="3"
              value={formData.promotionText}
              onChange={(event) => setFormData({ ...formData, promotionText: event.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Opcional"
            />
          </label>

          {errorMessage ? (
            <p className="md:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {errorMessage}
            </p>
          ) : null}

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
              Guardar parqueo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}