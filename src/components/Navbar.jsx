import { NavLink } from 'react-router-dom'
import { pageItems } from '../data/pageItems'
import brandIcon from '../assets/icon.jpg'

export default function Navbar() {
  return (
    <header className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-[#eef2f7] shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex items-center gap-2 px-4 py-3 md:min-w-52 md:py-4">
          <img src={brandIcon} alt="LiverGuard icon" className="h-7 w-7 rounded-sm object-cover" />
          <span className="page-title text-3xl font-semibold text-sky-700">LiverGuard</span>
        </div>

        <nav className="flex flex-1 flex-wrap items-center gap-2 px-4 py-2 md:justify-center md:px-1">
          {pageItems.map((page) => (
            <NavLink
              key={page.key}
              to={page.path}
              className={({ isActive }) =>
                `rounded-md px-3 py-1 text-sm font-semibold transition ${
                  isActive ? 'text-blue-800 underline underline-offset-4' : 'text-slate-600 hover:text-blue-700 hover:underline hover:underline-offset-4'
                }`
              }
            >
              {page.label}
            </NavLink>
          ))}
        </nav>

        <div className="relative isolate overflow-hidden border-t border-white/30 bg-gradient-to-r from-[#1f5fb9] via-[#2a72ce] to-[#2f84dc] px-7 py-3 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] md:min-w-[340px] md:border-l md:border-t-0">
          <div className="absolute left-0 top-0 h-full w-3 bg-[#184f9d]" aria-hidden="true" />
          <div className="absolute left-3 top-0 h-full w-10 -skew-x-[20deg] bg-white/10" aria-hidden="true" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/35" aria-hidden="true" />
          <p className="page-title relative text-center text-[1.65rem] font-semibold leading-tight">NAFLD Risk Prediction</p>
          <p className="relative text-center text-[11px] font-semibold tracking-[0.12em] text-blue-100">AI SCREENING SUPPORT</p>
        </div>
      </div>
    </header>
  )
}
