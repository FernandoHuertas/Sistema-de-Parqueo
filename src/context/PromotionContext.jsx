import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const PromotionContext = createContext(null)

export function PromotionProvider({ children }) {
  const [promotions, setPromotions] = useState([])

  const addPromotion = useCallback(
    ({ parkingId, title, text, expiryDate, hasExpiry }) => {
      const newPromotion = {
        id: `promo-${Date.now()}`,
        parkingId,
        title,
        text,
        expiryDate: hasExpiry ? expiryDate : null,
        createdAt: new Date(),
        isActive: true,
      }

      setPromotions((current) => [newPromotion, ...current])
      return newPromotion
    },
    [],
  )

  const updatePromotion = useCallback((promotionId, updates) => {
    setPromotions((current) =>
      current.map((promo) => (promo.id === promotionId ? { ...promo, ...updates } : promo)),
    )
  }, [])

  const deletePromotion = useCallback((promotionId) => {
    setPromotions((current) => current.filter((promo) => promo.id !== promotionId))
  }, [])

  const getActivePromotion = useCallback((parkingId) => {
    const now = new Date()

    return promotions.find((promo) => {
      if (!promo.isActive || promo.parkingId !== parkingId) {
        return false
      }

      if (promo.expiryDate && new Date(promo.expiryDate) < now) {
        return false
      }

      return true
    })
  }, [promotions])

  const getMostRecentActivePromotion = useCallback(() => {
    const now = new Date()

    const activePromos = promotions.filter((promo) => {
      if (!promo.isActive) {
        return false
      }

      if (promo.expiryDate && new Date(promo.expiryDate) < now) {
        return false
      }

      return true
    })

    return activePromos.length > 0 ? activePromos[0] : null
  }, [promotions])

  const value = useMemo(
    () => ({
      promotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
      getActivePromotion,
      getMostRecentActivePromotion,
    }),
    [promotions, addPromotion, updatePromotion, deletePromotion, getActivePromotion, getMostRecentActivePromotion],
  )

  return <PromotionContext.Provider value={value}>{children}</PromotionContext.Provider>
}

export function usePromotion() {
  const context = useContext(PromotionContext)

  if (!context) {
    throw new Error('usePromotion must be used within PromotionProvider')
  }

  return context
}
