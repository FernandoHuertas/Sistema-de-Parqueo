import { useMemo, useState } from 'react'
import { AddMunicipalZoneModal } from '../components/AddMunicipalZoneModal'
import { EditParkingModal } from '../components/EditParkingModal'
import { PromotionManagement } from '../components/PromotionManagement'
import { useParkingContext } from '../context/ParkingContext'
import { getStatus } from '../data/mockData'

const cardClass = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm'

const ADMIN_ROLES = {
  private_admin: {
    password: 'admin123',
    label: 'Admin de Parqueo',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
  municipal_admin: {
    password: 'municipal123',
    label: 'Municipalidad',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
}

function createMunicipalZoneId() {
  return `mz-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
}

export function AdminPanel() {
  const { parkings, setParkings, addParking } = useParkingContext()
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminRole, setAdminRole] = useState(null)
  const [editingParkingId, setEditingParkingId] = useState(null)
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false)

  const handleLogin = () => {
    const matchedRole = Object.entries(ADMIN_ROLES).find(([, role]) => role.password === password)

    if (matchedRole) {
      setIsAuthenticated(true)
      setAdminRole(matchedRole[0])
    }
  }

  const handleSaveParking = (updatedParking) => {
    setParkings((currentParkings) =>
      currentParkings.map((parking) =>
        parking.id === updatedParking.id
          ? {
              ...parking,
              ...updatedParking,
              availableSpaces: Math.max(0, Math.min(updatedParking.availableSpaces, updatedParking.totalSpaces)),
            }
          : parking,
      ),
    )
    setEditingParkingId(null)
  }

  const handleCreateMunicipalZone = ({ name, address, totalSpaces, pricePerHour, operatingHours }) => {
    addParking({
      id: createMunicipalZoneId(),
      name,
      type: 'municipal',
      address,
      lat: null,
      lng: null,
      totalSpaces,
      availableSpaces: totalSpaces,
      pricePerHour,
      hasCover: false,
      operatingHours,
      promotionText: null,
    })

    setIsAddZoneOpen(false)
  }

  const visibleParkings = useMemo(() => {
    if (adminRole === 'municipal_admin') {
      return parkings.filter((parking) => parking.type === 'municipal')
    }

    return parkings
  }, [adminRole, parkings])

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <section className={cardClass}>
          <h2 className="text-2xl font-bold text-slate-900">Acceso administrador</h2>
          <p className="mt-1 text-sm text-slate-600">Ingresá la contraseña para administrar parqueos.</p>
          <div className="mt-4 grid gap-3">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Ingresar
            </button>
          </div>
        </section>
      </main>
    )
  }

  const summary = {
    total: visibleParkings.length,
    available: visibleParkings.filter((parking) => getStatus(parking) === 'available').length,
    few: visibleParkings.filter((parking) => getStatus(parking) === 'few').length,
    full: visibleParkings.filter((parking) => getStatus(parking) === 'full').length,
  }

  const selectedParking = visibleParkings.find((parking) => parking.id === editingParkingId) ?? null
  const roleConfig = ADMIN_ROLES[adminRole]

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Panel administrativo</h2>
            {roleConfig ? (
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${roleConfig.badgeClass}`}>
                {roleConfig.label}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-slate-600">Gestion local de parqueos y disponibilidad.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(false)
            setAdminRole(null)
            setPassword('')
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Logout
        </button>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Total ubicaciones</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{summary.total}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Disponibles</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{summary.available}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Con pocos espacios</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{summary.few}</p>
        </article>
        <article className={cardClass}>
          <p className="text-sm font-medium text-slate-500">Llenos</p>
          <p className="mt-1 text-3xl font-bold text-rose-600">{summary.full}</p>
        </article>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Listado de parqueos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Available/Total spaces</th>
                <th className="px-5 py-3 font-semibold">Price/hour</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {visibleParkings.map((parking) => {
                const status = getStatus(parking)

                return (
                  <tr key={parking.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">{parking.name}</td>
                    <td className="px-5 py-3 text-slate-700">{parking.type}</td>
                    <td className="px-5 py-3 text-slate-700">
                      {parking.availableSpaces}/{parking.totalSpaces}
                    </td>
                    <td className="px-5 py-3 text-slate-700">{parking.pricePerHour} CRC</td>
                    <td className="px-5 py-3 text-slate-700">{status}</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setEditingParkingId(parking.id)}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {adminRole === 'municipal_admin' ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsAddZoneOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Agregar zona de vía pública
          </button>
        </div>
      ) : null}

      <PromotionManagement parkings={visibleParkings} adminRole={adminRole} />

      {selectedParking ? (
        <EditParkingModal
          parking={selectedParking}
          onClose={() => setEditingParkingId(null)}
          onSave={handleSaveParking}
        />
      ) : null}

      <AddMunicipalZoneModal
        isOpen={isAddZoneOpen}
        onClose={() => setIsAddZoneOpen(false)}
        onCreate={handleCreateMunicipalZone}
      />
    </main>
  )
}
