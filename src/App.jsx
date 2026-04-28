import { Navigate, Route, Routes } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { ParkingProvider } from './context/ParkingContext'
import { AdminPanel } from './pages/AdminPanel'
import { ClientMapView } from './pages/ClientMapView'

function App() {
  return (
    <ParkingProvider>
      <div className="min-h-screen">
        <TopNav />
        <Routes>
          <Route path="/" element={<ClientMapView />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ParkingProvider>
  )
}

export default App
