
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderOpen,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  MessageCircle,
} from 'lucide-react'

import StatusBadge from '../components/StatusBadge.jsx'
import { leadsService } from '../data/leads.js'
import { portfolioService } from '../data/portfolioService.js'
import { packagesService } from '../data/packagesService.js'
import { packages } from '../data/packages.js'
import { whatsappLink } from '../data/contact.js'

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-border p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
    >
      <Icon size={22} className="text-white" aria-hidden="true" />
    </div>

    <div>
      <p className="text-2xl font-extrabold text-dark">{value}</p>
      <p className="text-sm font-medium text-secondary mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray mt-1">{sub}</p>}
    </div>
  </div>
)

// Mengambil array dari beberapa format respons API.
const getArray = (result) => {
  if (Array.isArray(result)) return result
  if (Array.isArray(result?.data)) return result.data
  if (Array.isArray(result?.data?.data)) return result.data.data
  if (Array.isArray(result?.leads)) return result.leads
  if (Array.isArray(result?.portfolios)) return result.portfolios
  if (Array.isArray(result?.packages)) return result.packages

  return []
}

// Menyamakan format statistik agar selalu memiliki angka.
const normalizeStats = (result) => {
  const data = result?.data?.data ?? result?.data ?? result ?? {}

  return {
    total: Number(data.total ?? data.total_leads ?? 0),
    newLeads: Number(
      data.newLeads ?? data.new_leads ?? data.baru ?? 0
    ),
    contacted: Number(
      data.contacted ?? data.dihubungi ?? 0
    ),
    completed: Number(
      data.completed ?? data.selesai ?? 0
    ),
  }
}

const Dashboard = () => {
  const [leads, setLeads] = useState([])

  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    completed: 0,
  })

  const [portfolioStats, setPortfolioStats] = useState({
    total: 0,
    published: 0,
  })

  const [packageCount, setPackageCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      const results = await Promise.allSettled([
        leadsService.getAll(),
        leadsService.getStats(),
        portfolioService.getAll(),
        packagesService.getAll(),
      ])

      if (!isMounted) return

      const [
        leadsResult,
        statsResult,
        portfolioResult,
        packagesResult,
      ] = results

      // Data konsultasi terbaru
      if (leadsResult.status === 'fulfilled') {
        const leadData = getArray(leadsResult.value)
        setLeads(leadData.slice(0, 5))
      } else {
        console.error(
          'Gagal memuat data leads:',
          leadsResult.reason
        )
      }

      // Statistik leads
      if (statsResult.status === 'fulfilled') {
        setStats(normalizeStats(statsResult.value))
      } else {
        console.error(
          'Gagal memuat statistik leads:',
          statsResult.reason
        )
      }

      // Statistik portofolio dihitung dari daftar proyek.
      if (portfolioResult.status === 'fulfilled') {
        const projectData = getArray(portfolioResult.value)

        setPortfolioStats({
          total: projectData.length,
          published: projectData.filter((project) => {
            const status = String(project?.status ?? '').toLowerCase()
            return status === 'published'
          }).length,
        })
      } else {
        console.error(
          'Gagal memuat data portofolio:',
          portfolioResult.reason
        )
      }

      // Jumlah paket
      if (packagesResult.status === 'fulfilled') {
        const packageData = getArray(packagesResult.value)
        setPackageCount(packageData.length)
      } else {
        console.error(
          'Gagal memuat data paket:',
          packagesResult.reason
        )

        // Gunakan data lokal jika API paket belum tersedia.
        setPackageCount(Array.isArray(packages) ? packages.length : 0)
      }
    }

    loadDashboard().catch((error) => {
      console.error('Gagal memuat dashboard:', error)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const getPkgName = (id) => {
    return packages.find((item) => item.id === id)?.name || id || '-'
  }

  const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark">
          Dashboard
        </h1>
        <p className="text-gray text-sm mt-1">
          Selamat datang di panel admin Senvra Arsitektur Studio.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon={FolderOpen}
          label="Total Proyek"
          value={portfolioStats.total}
          sub={`${portfolioStats.published} published`}
          color="bg-primary"
        />

        <StatCard
          icon={Package}
          label="Total Paket"
          value={packageCount}
          sub="Paket aktif"
          color="bg-purple-500"
        />

        <StatCard
          icon={Users}
          label="Total Leads"
          value={stats.total}
          sub={`${stats.contacted} dihubungi · ${stats.completed} selesai`}
          color="bg-emerald-500"
        />

        <StatCard
          icon={TrendingUp}
          label="Leads Baru"
          value={stats.newLeads}
          sub="Belum direspons"
          color="bg-accent"
        />
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="font-bold text-dark">
            Konsultasi Terbaru
          </h2>

          <Link
            to="/admin/leads"
            className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            Lihat Semua
            <ArrowRight size={14} />
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="py-16 text-center">
            <Users
              size={32}
              className="text-gray/40 mx-auto mb-3"
            />
            <p className="font-medium text-dark">
              Belum ada konsultasi
            </p>
            <p className="text-gray text-sm mt-1">
              Lead baru akan muncul setelah calon klien mengirim form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]" role="table">
              <thead>
                <tr className="bg-background">
                  {[
                    'Nama',
                    'WhatsApp',
                    'Paket',
                    'Tanggal',
                    'Status',
                    'Aksi',
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray border-b border-border"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {leads.map((lead, index) => {
                  const id = lead.id ?? lead._id
                  const name = lead.name ?? lead.nama ?? '-'
                  const email = lead.email ?? '-'
                  const whatsapp = lead.whatsapp ?? lead.no_whatsapp ?? '-'
                  const packageId = lead.packageId ?? lead.package_id
                  const createdAt = lead.createdAt ?? lead.created_at
                  const status = lead.status ?? 'baru'

                  return (
                    <tr
                      key={id ?? `${name}-${index}`}
                      className={`hover:bg-background transition-colors ${
                        index < leads.length - 1
                          ? 'border-b border-border'
                          : ''
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-dark text-sm">
                          {name}
                        </p>
                        <p className="text-gray text-xs">{email}</p>
                      </td>

                      <td className="px-5 py-4 text-sm text-secondary">
                        {whatsapp}
                      </td>

                      <td className="px-5 py-4 text-sm text-secondary">
                        {getPkgName(packageId)}
                      </td>

                      <td className="px-5 py-4 text-sm text-secondary">
                        {formatDate(createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/leads/${id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-primary-50 text-secondary hover:text-primary transition-colors"
                            aria-label={`Lihat detail ${name}`}
                          >
                            <Eye size={15} />
                          </Link>

                          <a
                            href={whatsappLink(
                              `Halo ${name}, ini dari Senvra Arsitektur Studio mengenai konsultasi Anda.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-green-50 text-secondary hover:text-green-600 transition-colors"
                            aria-label={`Hubungi ${name} via WhatsApp`}
                          >
                            <MessageCircle size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            to: '/admin/portfolio',
            label: 'Kelola Portofolio',
            icon: FolderOpen,
            desc: 'Tambah / edit proyek',
          },
          {
            to: '/admin/packages',
            label: 'Kelola Paket',
            icon: Package,
            desc: 'Update harga & fitur',
          },
          {
            to: '/admin/leads',
            label: 'Kelola Leads',
            icon: Users,
            desc: 'Lihat semua konsultasi',
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 bg-white border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              <item.icon
                size={18}
                className="text-primary group-hover:text-white"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="font-semibold text-dark text-sm">
                {item.label}
              </p>
              <p className="text-gray text-xs mt-0.5">
                {item.desc}
              </p>
            </div>

            <ArrowRight
              size={16}
              className="ml-auto text-gray group-hover:text-primary transition-colors"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard