import { useState } from 'react'
import { usePromotion } from '../context/PromotionContext'
import { useParkingContext } from '../context/ParkingContext'

export function HeroPromotion({ onParkingSelect }) {
  const { getMostRecentActivePromotion } = usePromotion()
  const { parkings } = useParkingContext()
  const [isOpen, setIsOpen] = useState(false)

  const activePromotion = getMostRecentActivePromotion()

  if (!activePromotion) {
    return null
  }

  const parking = parkings.find((p) => p.id === activePromotion.parkingId)

  if (!parking) {
    return null
  }

  return (
    <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-lg ring-2 ring-amber-200">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="mb-2 inline-flex items-center rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-900">
            ✨ Promoción destacada
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{activePromotion.title}</h2>
          <p className="mt-2 text-sm text-slate-700">{activePromotion.text}</p>
          <p className="mt-3 text-xs font-semibold text-amber-900">
            📍 {parking.name} • {parking.pricePerHour} CRC/hora
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onParkingSelect(parking.id)
            setIsOpen(true)
          }}
          className="flex-shrink-0 rounded-lg bg-amber-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-amber-700 hover:shadow-lg"
        >
          Ver parqueo →
        </button>
      </div>
    </div>
  )
}
