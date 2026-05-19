import { useCallback, useState } from 'react'
import { usePromotion } from '../context/PromotionContext'

export function PromotionManagement({ parkings, adminRole }) {
  const { promotions, addPromotion, deletePromotion, getActivePromotion } = usePromotion()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [selectedParkingId, setSelectedParkingId] = useState('')
  const [hasExpiry, setHasExpiry] = useState(false)
  const [expiryDate, setExpiryDate] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = useCallback(() => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = 'El título es requerido'
    } else if (title.length > 60) {
      newErrors.title = 'Máximo 60 caracteres'
    }

    if (!text.trim()) {
      newErrors.text = 'El texto es requerido'
    } else if (text.length > 150) {
      newErrors.text = 'Máximo 150 caracteres'
    }

    if (!selectedParkingId) {
      newErrors.parking = 'Debes seleccionar un parqueo'
    }

    if (hasExpiry && !expiryDate) {
      newErrors.expiry = 'Debes seleccionar una fecha'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    addPromotion({
      parkingId: selectedParkingId,
      title: title.trim(),
      text: text.trim(),
      expiryDate: hasExpiry ? expiryDate : null,
      hasExpiry,
    })

    setTitle('')
    setText('')
    setSelectedParkingId('')
    setHasExpiry(false)
    setExpiryDate('')
    setErrors({})
    setIsOpen(false)
  }, [title, text, selectedParkingId, hasExpiry, expiryDate, addPromotion])

  const visibleParkings = adminRole === 'municipal_admin' ? parkings.filter((p) => p.type === 'municipal') : parkings

  const activePromotions = promotions.filter((promo) => promo.isActive)

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Gestionar Promoción</h3>
      </div>

      <div className="px-5 py-4">
        {activePromotions.length > 0 ? (
          <div className="mb-4 rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Promociones activas:</p>
            <div className="mt-3 space-y-2">
              {activePromotions.map((promo) => {
                const parking = parkings.find((p) => p.id === promo.parkingId)

                return (
                  <div key={promo.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{promo.title}</p>
                      <p className="text-sm text-slate-600">{parking?.name}</p>
                      {promo.expiryDate && (
                        <p className="text-xs text-slate-500">
                          Vence: {new Date(promo.expiryDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deletePromotion(promo.id)}
                      className="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p className="mb-4 text-sm text-slate-600">No hay promociones activas</p>
        )}

        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            + Crear promoción
          </button>
        ) : (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Título (máx 60 caracteres)</label>
              <input
                type="text"
                maxLength="60"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
                }}
                placeholder="Ej: Estacionamiento gratis por 2 horas"
                className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
              <p className="mt-1 text-xs text-slate-500">{title.length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Texto (máx 150 caracteres)</label>
              <textarea
                maxLength="150"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  if (errors.text) setErrors((prev) => ({ ...prev, text: '' }))
                }}
                placeholder="Descripción de la promoción..."
                rows="3"
                className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.text ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              />
              {errors.text && <p className="mt-1 text-xs text-red-600">{errors.text}</p>}
              <p className="mt-1 text-xs text-slate-500">{text.length}/150</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Parqueo</label>
              <select
                value={selectedParkingId}
                onChange={(e) => {
                  setSelectedParkingId(e.target.value)
                  if (errors.parking) setErrors((prev) => ({ ...prev, parking: '' }))
                }}
                className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.parking ? 'border-red-300 bg-red-50' : 'border-slate-300'
                }`}
              >
                <option value="">Selecciona un parqueo</option>
                {visibleParkings.map((parking) => (
                  <option key={parking.id} value={parking.id}>
                    {parking.name}
                  </option>
                ))}
              </select>
              {errors.parking && <p className="mt-1 text-xs text-red-600">{errors.parking}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasExpiry"
                checked={hasExpiry}
                onChange={(e) => setHasExpiry(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="hasExpiry" className="text-sm font-medium text-slate-700">
                Sin vencimiento
              </label>
            </div>

            {!hasExpiry && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Fecha de vencimiento</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value)
                    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: '' }))
                  }}
                  className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm ${
                    errors.expiry ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                />
                {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Guardar promoción
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setTitle('')
                  setText('')
                  setSelectedParkingId('')
                  setHasExpiry(false)
                  setExpiryDate('')
                  setErrors({})
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
