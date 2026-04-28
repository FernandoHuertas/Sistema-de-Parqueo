import { NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100',
  ].join(' ')

export function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Sistema de Parqueos</h1>
          <p className="text-sm text-slate-500">Ciudad Quesada, Costa Rica</p>
        </div>
        <nav className="flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Vista cliente
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Panel admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
