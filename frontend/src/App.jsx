import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Layout
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Public Pages
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Portfolio from './pages/Portfolio.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Pricing from './pages/Pricing.jsx'
import Consultation from './pages/Consultation.jsx'
import Contact from './pages/Contact.jsx'

// Admin
import AdminLayout from './admin/AdminLayout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import PortfolioManagement from './admin/PortfolioManagement.jsx'
import PackageManagement from './admin/PackageManagement.jsx'
import LeadsManagement from './admin/LeadsManagement.jsx'
import LeadDetail from './admin/LeadDetail.jsx'
import AdminSettings from './admin/AdminSettings.jsx'

/** Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

/** Loading fallback */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-gray text-sm">Memuat halaman...</p>
    </div>
  </div>
)

/** 404 Not Found */
const NotFound = () => (
  <div className="min-h-[80vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <p className="text-8xl font-extrabold text-primary/10 leading-none select-none">404</p>
      <h1 className="text-2xl font-extrabold text-dark mt-4">Halaman Tidak Ditemukan</h1>
      <p className="text-secondary mt-2 mb-8">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
      >
        Kembali ke Beranda
      </a>
    </div>
  </div>
)

/** Public layout wrapper (Navbar + content + Footer) */
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="min-h-screen">{children}</div>
    <Footer />
  </>
)

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Routes ── */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/portfolio"
          element={
            <PublicLayout>
              <Portfolio />
            </PublicLayout>
          }
        />
        <Route
          path="/portfolio/:id"
          element={
            <PublicLayout>
              <ProjectDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <PublicLayout>
              <Pricing />
            </PublicLayout>
          }
        />
        <Route
          path="/consultation"
          element={
            <PublicLayout>
              <Consultation />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        {/* ── Admin Routes ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<PortfolioManagement />} />
          <Route path="packages" element={<PackageManagement />} />
          <Route path="leads" element={<LeadsManagement />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── 404 ── */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default App
