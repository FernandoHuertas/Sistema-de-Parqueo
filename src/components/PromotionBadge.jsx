import { usePromotion } from '../context/PromotionContext'

export function PromotionBadge({ parkingId }) {
  const { getActivePromotion } = usePromotion()

  const promotion = getActivePromotion(parkingId)

  if (!promotion) {
    return null
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-md">
      ⭐ DESTACADO
    </span>
  )
}
