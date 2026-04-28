import { createContext, useContext, useMemo } from 'react'
import { PARKING_DATA } from '../data/mockData'

const ParkingContext = createContext(null)

export function ParkingProvider({ children }) {
  const value = useMemo(() => ({ parkings: PARKING_DATA }), [])

  return (
    <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>
  )
}

export function useParkingContext() {
  const context = useContext(ParkingContext)

  if (!context) {
    throw new Error('useParkingContext must be used within ParkingProvider')
  }

  return context
}
