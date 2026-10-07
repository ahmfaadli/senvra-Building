import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/portfolio', label: 'Portofolio', icon: FolderOpen },
      { to: '/admin/packages', label: 'Paket Harga', icon: Package },
    ],
  },
  {
    label: 'Customer',
    items: [
      { to: '/admin/leads', label: 'Leads / Konsultasi', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleLogout = () => {
    // In production: clear auth token and redirect
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-dark flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <Link to="/" className="flex flex-col leading-none" aria-label="Senvra – back to site">
            <span className="text-lg font-extrabold text-white tracking-tight">Senvra</span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-white/40">
              Admin Panel
            </span>
          </Link>
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-white/60 hover:text-white hover:bg-white/8'
                        }`
                      }
                    >
                      <item.icon size={17} aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <ChevronRight size={17} aria-hidden="true" />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <LogOut size={17} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 md:px-6 gap-4 shrink-0">
          {/* Hamburger */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center text-secondary hover:bg-background rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Page title slot — filled by child via context or just spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="relative w-9 h-9 flex items-center justify-center text-secondary hover:bg-background rounded-lg transition-colors"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
            </button>

            {/* Avatar */}
            <div
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold"
              aria-label="Admin user"
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
