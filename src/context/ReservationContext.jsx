import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { useParkingData } from './ParkingDataContext'

const ReservationContext = createContext(null)

const initialState = {
  reservations: [],
  alert: null,
}

function reservationReducer(state, action) {
  switch (action.type) {
    case 'MAKE_RESERVATION':
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
      }
    case 'CANCEL_RESERVATION':
      return {
        ...state,
        reservations: state.reservations.map((reservation) =>
          reservation.id === action.payload
            ? { ...reservation, status: 'cancelled' }
            : reservation,
        ),
      }
    case 'SIMULATE_SPACE_TAKEN':
      return {
        ...state,
        alert: action.payload,
      }
    case 'DISMISS_ALERT':
      return {
        ...state,
        alert: null,
      }
    case 'CLEAR_RESERVATION_HISTORY':
      return {
        ...state,
        reservations: state.reservations.filter((reservation) => reservation.status === 'active'),
      }
    default:
      return state
  }
}

function buildReservationId() {
  return `RES-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
}

export function ReservationProvider({ children }) {
  const { parkings, adjustParkingAvailability } = useParkingData()
  const [state, dispatch] = useReducer(reservationReducer, initialState)

  const activeReservations = useMemo(
    () => state.reservations.filter((reservation) => reservation.status === 'active'),
    [state.reservations],
  )

  useEffect(() => {
    if (state.alert && !activeReservations.some((reservation) => reservation.id === state.alert.reservationId)) {
      dispatch({ type: 'DISMISS_ALERT' })
    }
  }, [activeReservations, state.alert])

  const makeReservation = useCallback((parkingId) => {
    const parking = parkings.find((currentParking) => currentParking.id === parkingId)

    if (!parking || parking.availableSpaces <= 0) {
      return null
    }

    const reservation = {
      id: buildReservationId(),
      parkingId,
      spaceNumber: parking.totalSpaces - parking.availableSpaces + 1,
      timestamp: new Date().toISOString(),
      status: 'active',
    }

    adjustParkingAvailability(parkingId, -1)
    dispatch({ type: 'MAKE_RESERVATION', payload: reservation })

    return reservation
  }, [adjustParkingAvailability, parkings])

  const cancelReservation = useCallback((reservationId) => {
    const reservation = state.reservations.find((currentReservation) => currentReservation.id === reservationId)

    if (!reservation || reservation.status !== 'active') {
      return false
    }

    adjustParkingAvailability(reservation.parkingId, 1)
    dispatch({ type: 'CANCEL_RESERVATION', payload: reservationId })

    if (state.alert?.reservationId === reservationId) {
      dispatch({ type: 'DISMISS_ALERT' })
    }

    return true
  }, [adjustParkingAvailability, state.alert, state.reservations])

  const simulateSpaceTaken = useCallback(() => {
    const active = state.reservations.filter((reservation) => reservation.status === 'active')

    if (active.length === 0 || Math.random() > 0.1) {
      return null
    }

    const selectedReservation = active[Math.floor(Math.random() * active.length)]
    const selectedParking = parkings.find((parking) => parking.id === selectedReservation.parkingId)

    if (!selectedParking) {
      return null
    }

    const alert = {
      reservationId: selectedReservation.id,
      parkingId: selectedParking.id,
      parkingName: selectedParking.name,
      spaceNumber: selectedReservation.spaceNumber,
      timestamp: new Date().toISOString(),
    }

    dispatch({ type: 'SIMULATE_SPACE_TAKEN', payload: alert })
    return alert
  }, [parkings, state.reservations])

  const dismissAlert = useCallback(() => dispatch({ type: 'DISMISS_ALERT' }), [])

  const clearReservationHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_RESERVATION_HISTORY' })
  }, [])

  const value = useMemo(
    () => ({
      reservations: state.reservations,
      activeReservations,
      alert: state.alert,
      makeReservation,
      cancelReservation,
      simulateSpaceTaken,
      dismissAlert,
      clearReservationHistory,
    }),
    [
      activeReservations,
      state.alert,
      state.reservations,
      makeReservation,
      cancelReservation,
      simulateSpaceTaken,
      dismissAlert,
      clearReservationHistory,
    ],
  )

  return <ReservationContext.Provider value={value}>{children}</ReservationContext.Provider>
}

export function useReservation() {
  const context = useContext(ReservationContext)

  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider')
  }

  return context
}
