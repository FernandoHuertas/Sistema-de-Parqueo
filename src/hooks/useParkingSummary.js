import { useMemo } from 'react'
import { useParkingContext } from '../context/ParkingContext'
import { getStatus } from '../data/mockData'

export function useParkingSummary() {
  const { parkings } = useParkingContext()

  return useMemo(() => {
    const total = parkings.length
    const available = parkings.filter((parking) => getStatus(parking) === 'available').length
    const few = parkings.filter((parking) => getStatus(parking) === 'few').length
    const full = parkings.filter((parking) => getStatus(parking) === 'full').length

    return { total, available, few, full }
  }, [parkings])
}
