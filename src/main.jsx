import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ParkingDataProvider } from './context/ParkingDataContext'
import { ReservationProvider } from './context/ReservationContext'
import { PromotionProvider } from './context/PromotionContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ParkingDataProvider>
        <ReservationProvider>
          <PromotionProvider>
            <App />
          </PromotionProvider>
        </ReservationProvider>
      </ParkingDataProvider>
    </BrowserRouter>
  </StrictMode>,
)
