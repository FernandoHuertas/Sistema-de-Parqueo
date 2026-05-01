import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { PARKING_DATA } from '../data/mockData'

const ParkingDataContext = createContext(null)

export function ParkingDataProvider({ children }) {
  const [parkings, setParkings] = useState(() => PARKING_DATA)

  const updateParking = useCallback((parkingId, changes) => {
    setParkings((currentParkings) =>
      currentParkings.map((parking) =>
        parking.id === parkingId ? { ...parking, ...changes } : parking,
      ),
    )
  }, [])

  const adjustParkingAvailability = useCallback((parkingId, delta) => {
    setParkings((currentParkings) =>
      currentParkings.map((parking) => {
        if (parking.id !== parkingId) {
          return parking
        }

        const nextAvailableSpaces = Math.min(
          parking.totalSpaces,
          Math.max(0, parking.availableSpaces + delta),
        )

        return { ...parking, availableSpaces: nextAvailableSpaces }
      }),
    )
  }, [])

  const addParking = useCallback((parking) => {
    setParkings((currentParkings) => [...currentParkings, parking])
  }, [])

  const value = useMemo(
    () => ({
      parkings,
      setParkings,
      updateParking,
      adjustParkingAvailability,
      addParking,
    }),
    [addParking, adjustParkingAvailability, parkings, updateParking],
  )

  return <ParkingDataContext.Provider value={value}>{children}</ParkingDataContext.Provider>
}

export function useParkingData() {
  const context = useContext(ParkingDataContext)

  if (!context) {
    throw new Error('useParkingData must be used within ParkingDataProvider')
  }

  return context
}
