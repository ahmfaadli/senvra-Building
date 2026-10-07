import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import {
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Phone,
  Mail,
  Maximize2,
  Building2,
  Package,
  FileText,
  Calendar,
  User,
  ChevronRight
} from 'lucide-react'

import Button from '../components/Button.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { leadsService } from '../data/leads.js'
import { packages } from '../data/packages.js'
import { whatsappLink } from '../data/contact.js'

const LeadDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await leadsService.getById(id)

        if (!data) {
          navigate('/admin/leads', { replace: true })
          return
        }

        setLead(data)
      } catch (err) {
        console.error('Gagal mengambil detail lead:', err)

        setError(
          err?.response?.data?.message ||
          'Gagal mengambil data lead.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLead()
  }, [id, navigate])

  const updateStatus = async (status) => {
    try {
      setSaving(status)
      setError('')

      const updated = await leadsService.updateStatus(id, status)

      setLead(updated)
    } catch (err) {
      console.error('Gagal mengubah status:', err)

      setError(
        err?.response?.data?.message ||
        'Gagal mengubah status lead.'
      )
    } finally {
      setSaving(null)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'

    const date = new Date(iso)

    if (Number.isNaN(date.getTime())) {
      return '—'
    }

    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/leads"
          className="inline-flex items-center gap-2 text-sm text-gray hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Leads
        </Link>

        <div className="bg-white rounded-2xl border border-border p-6">
          <p className="text-sm text-gray">
            Data lead tidak ditemukan.
          </p>
        </div>
      </div>
    )
  }

  const pkg = packages.find(
    (p) => p.id === lead.packageId
  )

  const waMsg = `Halo ${lead.name}, ini dari Senvra Arsitektur Studio. Kami ingin menindaklanjuti konsultasi Anda mengenai ${lead.buildingType || 'proyek Anda'} dengan paket ${pkg?.name || lead.packageId || '-'}.`

  const clientData = [
    {
      icon: User,
      label: 'Nama Lengkap',
      value: lead.name
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: lead.whatsapp,
      href: whatsappLink(waMsg)
    },
    {
      icon: Mail,
      label: 'Email',
      value: lead.email,
      href: lead.email
        ? `mailto:${lead.email}`
        : null
    }
  ]

  const projectData = [
    {
      icon: Maximize2,
      label: 'Luas Bangunan',
      value: lead.area
        ? `${lead.area} m²`
        : '—'
    },
    {
      icon: Building2,
      label: 'Jenis Bangunan',
      value: lead.buildingType || '—'
    },
    {
      icon: Package,
      label: 'Paket Dipilih',
      value: pkg?.name || lead.packageId || '—'
    },
    {
      icon: Calendar,
      label: 'Tanggal Pengiriman',
      value: formatDate(lead.createdAt)
    }
  ]

  const statuses = [
    'Baru',
    'Dihubungi',
    'Selesai'
  ]

  const currentIdx = statuses.indexOf(lead.status)

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Back */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/leads"
          className="flex items-center gap-2 text-sm text-gray hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Leads
        </Link>

        <ChevronRight
          size={14}
          className="text-border"
        />

        <span className="text-sm text-dark font-medium">
          {lead.name}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-border p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary font-extrabold text-lg shrink-0">
            {lead.name
              ?.slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <h1 className="text-xl font-extrabold text-dark">
              {lead.name}
            </h1>

            <p className="text-gray text-sm">
              {lead.email || 'Tidak ada email'}
            </p>

            <div className="mt-1.5">
              <StatusBadge status={lead.status} />
            </div>
          </div>

        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">

          <a
            href={whatsappLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <MessageCircle size={16} />
            Hubungi via WhatsApp
          </a>

          {lead.status !== 'Dihubungi' &&
            lead.status !== 'Selesai' && (
              <Button
                variant="outline"
                size="md"
                loading={saving === 'Dihubungi'}
                onClick={() =>
                  updateStatus('Dihubungi')
                }
              >
                <Phone size={15} />
                Tandai Dihubungi
              </Button>
            )}

          {lead.status !== 'Selesai' && (
            <Button
              variant="primary"
              size="md"
              loading={saving === 'Selesai'}
              onClick={() =>
                updateStatus('Selesai')
              }
            >
              <CheckCircle size={15} />
              Tandai Selesai
            </Button>
          )}

        </div>
      </div>

      {/* Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Data Klien */}
        <div className="bg-white rounded-2xl border border-border p-6">

          <h2 className="font-bold text-dark mb-5 flex items-center gap-2">
            <User
              size={16}
              className="text-primary"
            />
            Data Klien
          </h2>

          <dl className="space-y-4">

            {clientData.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3"
              >

                <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon
                    size={15}
                    className="text-gray"
                  />
                </div>

                <div>
                  <dt className="text-xs text-gray font-medium uppercase tracking-wide">
                    {item.label}
                  </dt>

                  {item.href ? (
                    <dd>
                      <a
                        href={item.href}
                        target={
                          item.label === 'WhatsApp'
                            ? '_blank'
                            : undefined
                        }
                        rel={
                          item.label === 'WhatsApp'
                            ? 'noopener noreferrer'
                            : undefined
                        }
                        className="text-dark font-semibold text-sm hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    </dd>
                  ) : (
                    <dd className="text-dark font-semibold text-sm">
                      {item.value || '—'}
                    </dd>
                  )}
                </div>

              </div>
            ))}

          </dl>
        </div>

        {/* Data Proyek */}
        <div className="bg-white rounded-2xl border border-border p-6">

          <h2 className="font-bold text-dark mb-5 flex items-center gap-2">
            <Building2
              size={16}
              className="text-primary"
            />
            Data Proyek
          </h2>

          <dl className="space-y-4">

            {projectData.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3"
              >

                <div className="w-9 h-9 bg-background rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon
                    size={15}
                    className="text-gray"
                  />
                </div>

                <div>
                  <dt className="text-xs text-gray font-medium uppercase tracking-wide">
                    {item.label}
                  </dt>

                  <dd className="text-dark font-semibold text-sm mt-0.5">
                    {item.value}
                  </dd>
                </div>

              </div>
            ))}

          </dl>
        </div>
      </div>

      {/* Message */}
      {lead.message && (
        <div className="bg-white rounded-2xl border border-border p-6">

          <h2 className="font-bold text-dark mb-3 flex items-center gap-2">
            <FileText
              size={16}
              className="text-primary"
            />
            Pesan / Kebutuhan
          </h2>

          <p className="text-secondary text-sm leading-relaxed bg-background rounded-xl p-4 border border-border">
            {lead.message}
          </p>

        </div>
      )}

      {/* Status timeline */}
      <div className="bg-white rounded-2xl border border-border p-6">

        <h2 className="font-bold text-dark mb-5">
          Status Lead
        </h2>

        <div className="flex items-center gap-3">

          {statuses.map((status, idx) => {

            const isDone =
              idx <= currentIdx

            return (
              <React.Fragment key={status}>

                <div className="flex flex-col items-center gap-1.5">

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-primary text-white'
                        : 'bg-background border-2 border-border text-gray'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle size={16} />
                    ) : (
                      <span className="text-xs font-bold">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      isDone
                        ? 'text-primary'
                        : 'text-gray'
                    }`}
                  >
                    {status}
                  </span>

                </div>

                {idx < 2 && (
                  <div
                    className={`flex-1 h-0.5 mb-4 transition-colors ${
                      idx < currentIdx
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
                  />
                )}

              </React.Fragment>
            )
          })}

        </div>
      </div>

    </div>
  )
}

export default LeadDetail