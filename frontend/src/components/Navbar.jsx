import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from './Button.jsx'

const navLinks = [
  { to: '/', label: 'Beranda', exact: true },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/portfolio', label: 'Portofolio' },
  { to: '/pricing', label: 'Paket Harga' },
  { to: '/contact', label: 'Klien' },
  { to: '/contact', label: 'Kontak' },
]

const uniqueNavLinks = [
  { to: '/', label: 'Beranda', exact: true },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/portfolio', label: 'Portofolio' },
  { to: '/pricing', label: 'Paket Harga' },
  { to: '/contact', label: 'Kontak' },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isHomePage = location.pathname === '/'

  const navbarBg = scrolled || !isHomePage
    ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
    : 'bg-transparent'

  const linkColor = scrolled || !isHomePage ? 'text-secondary' : 'text-white'
  const logoColor = scrolled || !isHomePage ? 'text-dark' : 'text-white'

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container-xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className={`flex flex-col leading-none transition-colors duration-300 ${logoColor}`}
              aria-label="Senvra Arsitektur Studio - Beranda"
            >
              <span className="text-xl font-extrabold tracking-tight">Senvra</span>
              <span className={`text-xs font-medium tracking-widest uppercase ${scrolled || !isHomePage ? 'text-gray' : 'text-white/70'}`}>
                Arsitektur Studio
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {uniqueNavLinks.map((link) => (
                <NavLink
                  key={link.to + link.label}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? scrolled || !isHomePage
                          ? 'text-primary bg-primary-50 font-semibold'
                          : 'text-white font-semibold bg-white/10'
                        : `${linkColor} hover:text-primary ${scrolled || !isHomePage ? 'hover:bg-primary-50' : 'hover:bg-white/10 hover:text-white'}`
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                as={Link}
                to="/consultation"
                size="md"
                variant={scrolled || !isHomePage ? 'primary' : 'white'}
              >
                Konsultasi Gratis
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                scrolled || !isHomePage
                  ? 'text-dark hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-menu"
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border">
          <div className="flex flex-col leading-none">
            <span className="text-lg font-extrabold text-dark tracking-tight">Senvra</span>
            <span className="text-xs font-medium tracking-widest uppercase text-gray">
              Arsitektur Studio
            </span>
          </div>
          <button
            className="p-2 rounded-lg text-secondary hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex flex-col px-4 py-6 gap-1">
          {uniqueNavLinks.map((link) => (
            <NavLink
              key={link.to + link.label}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary-50 font-semibold'
                    : 'text-secondary hover:text-primary hover:bg-primary-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div className="px-4 pb-6">
          <Button as={Link} to="/consultation" size="lg" variant="primary" className="w-full">
            Konsultasi Gratis
          </Button>
        </div>
      </div>
    </>
  )
}

export default Navbar
