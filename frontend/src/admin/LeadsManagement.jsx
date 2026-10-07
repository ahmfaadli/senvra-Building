import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
  Eye,
  MessageCircle,
  Search,
  Users
} from 'lucide-react'

import StatusBadge from '../components/StatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { leadsService } from '../data/leads.js'
import { packages } from '../data/packages.js'
import { whatsappLink } from '../data/contact.js'

const STATUSES = [
  'Semua',
  'Baru',
  'Dihubungi',
  'Selesai'
]

const DEFAULT_STATS = {
  total: 0,
  newLeads: 0,
  contacted: 0,
  completed: 0
}

const LeadsManagement = () => {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState(DEFAULT_STATS)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')

  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const [error, setError] = useState('')

  // ==========================================
  // LOAD LEADS
  // ==========================================

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await leadsService.getAll()

      // Pastikan leads selalu berupa array
      if (Array.isArray(data)) {
        setLeads(data)
      } else {
        setLeads([])
        console.error(
          'Response leads bukan array:',
          data
        )
      }
    } catch (error) {
      console.error(
        'Gagal mengambil data leads:',
        error
      )

      setLeads([])

      setError(
        error?.response?.data?.message ||
        'Gagal mengambil data leads dari server.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // LOAD STATS
  // ==========================================

  const loadStats = async () => {
    try {
      setStatsLoading(true)

      const data = await leadsService.getStats()

      setStats({
        total: Number(data?.total || 0),
        newLeads: Number(data?.newLeads || 0),
        contacted: Number(data?.contacted || 0),
        completed: Number(data?.completed || 0)
      })
    } catch (error) {
      console.error(
        'Gagal mengambil statistik leads:',
        error
      )

      setStats(DEFAULT_STATS)
    } finally {
      setStatsLoading(false)
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadLeads()
    loadStats()
  }, [])

  // ==========================================
  // FILTER
  // ==========================================

  const filtered = useMemo(() => {
    // Safety: pastikan selalu array
    let list = Array.isArray(leads)
      ? leads
      : []

    // Filter status
    if (statusFilter !== 'Semua') {
      list = list.filter(
        (lead) =>
          lead?.status === statusFilter
      )
    }

    // Filter search
    if (search.trim()) {
      const q = search
        .trim()
        .toLowerCase()

      list = list.filter((lead) => {
        const name =
          String(lead?.name || '')
            .toLowerCase()

        const whatsapp =
          String(lead?.whatsapp || '')

        const email =
          String(lead?.email || '')
            .toLowerCase()

        return (
          name.includes(q) ||
          whatsapp.includes(q) ||
          email.includes(q)
        )
      })
    }

    return list
  }, [
    leads,
    statusFilter,
    search
  ])

  // ==========================================
  // PACKAGE NAME
  // ==========================================

  const getPkgName = (id) => {
    if (!id) return '—'

    return (
      packages.find(
        (pkg) => pkg.id === id
      )?.name || id
    )
  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (iso) => {
    if (!iso) return '—'

    const date = new Date(iso)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    return date.toLocaleDateString(
      'id-ID',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  // ==========================================
  // STATS DATA
  // ==========================================

  const statsData = [
    {
      label: 'Total Leads',
      value: stats.total,
      color: 'text-dark'
    },
    {
      label: 'Baru',
      value: stats.newLeads,
      color: 'text-blue-600'
    },
    {
      label: 'Dihubungi',
      value: stats.contacted,
      color: 'text-yellow-600'
    },
    {
      label: 'Selesai',
      value: stats.completed,
      color: 'text-green-600'
    }
  ]

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ======================================= */}

      <div>
        <h1 className="text-2xl font-extrabold text-dark">
          Leads / Konsultasi
        </h1>

        <p className="text-gray text-sm mt-1">
          {statsLoading
            ? 'Memuat statistik...'
            : `${stats.total} total · ${stats.newLeads} baru · ${stats.contacted} dihubungi · ${stats.completed} selesai`
          }
        </p>
      </div>

      {/* ======================================
          ERROR
      ======================================= */}

      {error && (
        <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">

          <p className="text-sm">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              loadLeads()
              loadStats()
            }}
            className="text-sm font-semibold underline hover:no-underline"
          >
            Coba lagi
          </button>

        </div>
      )}

      {/* ======================================
          STATS
      ======================================= */}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

        {statsData.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-border px-5 py-4"
          >
            <p
              className={`text-2xl font-extrabold ${stat.color}`}
            >
              {statsLoading ? (
                <span className="inline-block w-8 h-7 bg-background rounded animate-pulse" />
              ) : (
                stat.value
              )}
            </p>

            <p className="text-gray text-xs mt-1">
              {stat.label}
            </p>
          </div>
        ))}

      </div>

      {/* ======================================
          CONTROLS
      ======================================= */}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

        {/* Search */}
        <div className="relative flex-1 max-w-xs">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
          />

          <input
            type="search"
            placeholder="Cari nama atau nomor WhatsApp..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            aria-label="Cari leads"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-border rounded-lg text-dark placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />

        </div>

        {/* Status filters */}
        <div
          className="flex gap-2 flex-wrap"
          role="group"
          aria-label="Filter status"
        >

          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setStatusFilter(status)
              }
              aria-pressed={
                statusFilter === status
              }
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-secondary hover:bg-background'
              }`}
            >
              {status}
            </button>
          ))}

        </div>

      </div>

      {/* ======================================
          TABLE
      ======================================= */}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">

            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />

            <p className="text-gray text-sm mt-3">
              Memuat data leads...
            </p>

          </div>
        ) : filtered.length === 0 ? (

          /* Empty */
          <EmptyState
            icon={Users}
            title={
              search ||
              statusFilter !== 'Semua'
                ? 'Tidak ada hasil'
                : 'Belum ada konsultasi'
            }
            description={
              search ||
              statusFilter !== 'Semua'
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Lead baru akan muncul setelah calon klien mengirim form konsultasi.'
            }
          />

        ) : (

          /* Table */
          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              <thead>

                <tr className="bg-background border-b border-border">

                  {[
                    'Nama',
                    'WhatsApp',
                    'Luas',
                    'Paket',
                    'Status',
                    'Tanggal',
                    'Aksi'
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray"
                    >
                      {heading}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filtered.map((lead, index) => (

                  <tr
                    key={lead.id}
                    className={`hover:bg-background/50 transition-colors ${
                      index <
                      filtered.length - 1
                        ? 'border-b border-border'
                        : ''
                    }`}
                  >

                    {/* Nama */}
                    <td className="px-5 py-4">

                      <p className="font-semibold text-dark text-sm">
                        {lead.name || '—'}
                      </p>

                      <p className="text-gray text-xs">
                        {lead.email || '—'}
                      </p>

                    </td>

                    {/* WhatsApp */}
                    <td className="px-5 py-4 text-sm text-secondary">
                      {lead.whatsapp || '—'}
                    </td>

                    {/* Area */}
                    <td className="px-5 py-4 text-sm text-secondary">
                      {lead.area
                        ? `${lead.area} m²`
                        : '—'}
                    </td>

                    {/* Package */}
                    <td className="px-5 py-4 text-sm text-secondary">
                      {getPkgName(
                        lead.packageId
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          lead.status
                        }
                      />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-secondary whitespace-nowrap">
                      {formatDate(
                        lead.createdAt
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        {/* Detail */}
                        <Link
                          to={`/admin/leads/${lead.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-primary-50 text-gray hover:text-primary transition-colors border border-border"
                          aria-label={`Lihat detail ${lead.name}`}
                        >
                          <Eye size={15} />
                        </Link>

                        {/* WhatsApp */}
                        <a
                          href={whatsappLink(
                            `Halo ${lead.name}, ini dari Senvra Arsitektur Studio mengenai konsultasi Anda.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-green-50 text-gray hover:text-green-600 transition-colors border border-border"
                          aria-label={`Hubungi ${lead.name} via WhatsApp`}
                        >
                          <MessageCircle size={15} />
                        </a>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================
          FOOTER COUNT
      ======================================= */}

      {!loading &&
        filtered.length > 0 && (
          <p className="text-gray text-sm text-right">
            Menampilkan {filtered.length} dari{' '}
            {leads.length} leads
          </p>
        )}

    </div>
  )
}

export default LeadsManagement