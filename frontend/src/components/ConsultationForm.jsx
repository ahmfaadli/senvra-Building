import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CheckCircle,
  MessageCircle,
  AlertCircle,
} from 'lucide-react'

import Button from './Button.jsx'
import { leadsService } from '../data/leads.js'
import { packages } from '../data/packages.js'
import { whatsappLink } from '../data/contact.js'

const buildingTypes = [
  'Rumah Baru',
  'Renovasi',
  'Interior',
  'Lainnya',
]

const validate = (fields) => {
  const errors = {}

  if (!fields.name.trim()) {
    errors.name = 'Nama lengkap wajib diisi.'
  }

  if (!fields.whatsapp.trim()) {
    errors.whatsapp = 'Nomor WhatsApp wajib diisi.'
  } else if (
    !/^(\+62|62|0)[0-9]{8,13}$/.test(
      fields.whatsapp.replace(/\s|-/g, '')
    )
  ) {
    errors.whatsapp =
      'Format nomor WhatsApp tidak valid (contoh: 08123456789).'
  }

  if (!fields.email.trim()) {
    errors.email = 'Email wajib diisi.'
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)
  ) {
    errors.email = 'Format email tidak valid.'
  }

  if (!fields.area.trim()) {
    errors.area = 'Luas bangunan wajib diisi.'
  }

  if (!fields.buildingType) {
    errors.buildingType =
      'Jenis bangunan wajib dipilih.'
  }

  if (!fields.packageId) {
    errors.packageId =
      'Pilih paket terlebih dahulu.'
  }

  return errors
}

const ConsultationForm = () => {
  const [searchParams] = useSearchParams()

  const [fields, setFields] = useState({
    name: '',
    whatsapp: '',
    email: '',
    area: '',
    buildingType: '',
    packageId: searchParams.get('package') || '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const pkg = searchParams.get('package')

    if (pkg) {
      setFields((prev) => ({
        ...prev,
        packageId: pkg,
      }))
    }
  }, [searchParams])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFields((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (loading) return

  const newErrors = validate(fields)

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)

    const firstError =
      document.querySelector('[data-error="true"]')

    firstError?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    return
  }

  setLoading(true)
  setErrors({})

  try {
    const payload = {
      name: fields.name.trim(),
      whatsapp: fields.whatsapp.trim(),
      email: fields.email.trim(),
      area: fields.area.trim(),
      buildingType: fields.buildingType,
      packageId: fields.packageId,
      message: fields.message.trim(),
    }

    await leadsService.create(payload)

    setSubmitted(true)
  } catch (error) {
    console.error(
      'Gagal mengirim konsultasi:',
      error?.response?.data || error
    )

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Konsultasi gagal dikirim. Silakan coba lagi.'

    setErrors({
      submit: message,
    })
  } finally {
    setLoading(false)
  }
}

  if (submitted) {
    const selectedPkg = packages.find(
      (p) => p.id === fields.packageId
    )

    const waMsg = `Halo Senvra Arsitektur Studio, saya ${fields.name} ingin berkonsultasi mengenai ${fields.buildingType} dengan paket ${selectedPkg?.name || ''}. Luas bangunan: ${fields.area} m².`

    return (
      <div className="bg-white rounded-2xl border border-border p-8 md:p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle
            size={32}
            className="text-green-500"
          />
        </div>

        <h2 className="heading-md text-dark mb-3">
          Konsultasi Berhasil Dikirim!
        </h2>

        <p className="text-secondary body-md max-w-md mx-auto mb-8">
          Terima kasih,{' '}
          <strong>{fields.name}</strong>! Data konsultasi
          Anda telah berhasil dikirim. Tim Senvra akan
          segera menghubungi Anda melalui WhatsApp atau
          email.
        </p>

        <a
          href={whatsappLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm"
          aria-label="Chat langsung via WhatsApp"
        >
          <MessageCircle size={18} />
          Chat WhatsApp Sekarang
        </a>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl border border-border p-6 md:p-10 animate-fade-in"
      aria-label="Form konsultasi"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nama */}
        <FormField
          label="Nama Lengkap"
          required
          error={errors.name}
        >
          <input
            type="text"
            name="name"
            id="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso"
            autoComplete="name"
            aria-describedby={
              errors.name ? 'name-error' : undefined
            }
            aria-invalid={!!errors.name}
            data-error={!!errors.name}
            className={inputClass(errors.name)}
          />

          <ErrorMsg
            id="name-error"
            msg={errors.name}
          />
        </FormField>

        {/* WhatsApp */}
        <FormField
          label="Nomor WhatsApp"
          required
          error={errors.whatsapp}
        >
          <input
            type="tel"
            name="whatsapp"
            id="whatsapp"
            value={fields.whatsapp}
            onChange={handleChange}
            placeholder="08123456789"
            autoComplete="tel"
            aria-describedby={
              errors.whatsapp
                ? 'whatsapp-error'
                : undefined
            }
            aria-invalid={!!errors.whatsapp}
            data-error={!!errors.whatsapp}
            className={inputClass(errors.whatsapp)}
          />

          <ErrorMsg
            id="whatsapp-error"
            msg={errors.whatsapp}
          />
        </FormField>

        {/* Email */}
        <FormField
          label="Email"
          required
          error={errors.email}
        >
          <input
            type="email"
            name="email"
            id="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="email@contoh.com"
            autoComplete="email"
            aria-describedby={
              errors.email
                ? 'email-error'
                : undefined
            }
            aria-invalid={!!errors.email}
            data-error={!!errors.email}
            className={inputClass(errors.email)}
          />

          <ErrorMsg
            id="email-error"
            msg={errors.email}
          />
        </FormField>

        {/* Luas Bangunan */}
        <FormField
          label="Luas Bangunan (m²)"
          required
          error={errors.area}
        >
          <input
            type="text"
            name="area"
            id="area"
            value={fields.area}
            onChange={handleChange}
            placeholder="Contoh: 150"
            aria-describedby={
              errors.area
                ? 'area-error'
                : undefined
            }
            aria-invalid={!!errors.area}
            data-error={!!errors.area}
            className={inputClass(errors.area)}
          />

          <ErrorMsg
            id="area-error"
            msg={errors.area}
          />
        </FormField>

        {/* Jenis Bangunan */}
        <FormField
          label="Jenis Bangunan"
          required
          error={errors.buildingType}
        >
          <select
            name="buildingType"
            id="buildingType"
            value={fields.buildingType}
            onChange={handleChange}
            aria-describedby={
              errors.buildingType
                ? 'buildingType-error'
                : undefined
            }
            aria-invalid={!!errors.buildingType}
            data-error={!!errors.buildingType}
            className={inputClass(
              errors.buildingType
            )}
          >
            <option value="">
              Pilih jenis bangunan
            </option>

            {buildingTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>

          <ErrorMsg
            id="buildingType-error"
            msg={errors.buildingType}
          />
        </FormField>

        {/* Pilihan Paket */}
        <FormField
          label="Pilihan Paket"
          required
          error={errors.packageId}
        >
          <select
            name="packageId"
            id="packageId"
            value={fields.packageId}
            onChange={handleChange}
            aria-describedby={
              errors.packageId
                ? 'packageId-error'
                : undefined
            }
            aria-invalid={!!errors.packageId}
            data-error={!!errors.packageId}
            className={inputClass(errors.packageId)}
          >
            <option value="">
              Pilih paket
            </option>

            {packages.map((pkg) => (
              <option
                key={pkg.id}
                value={pkg.id}
              >
                {pkg.name}
              </option>
            ))}
          </select>

          <ErrorMsg
            id="packageId-error"
            msg={errors.packageId}
          />
        </FormField>

        {/* Pesan / Kebutuhan */}
        <FormField
          label="Pesan / Kebutuhan"
          className="md:col-span-2"
          error={errors.message}
        >
          <textarea
            name="message"
            id="message"
            rows={4}
            value={fields.message}
            onChange={handleChange}
            placeholder="Ceritakan kebutuhan dan keinginan desain Anda..."
            className={
              inputClass(errors.message) +
              ' resize-none'
            }
          />
        </FormField>
      </div>

      {/* API Error */}
      {errors.submit && (
        <div
          className="mt-5 flex items-center gap-2 text-xs text-accent font-medium"
          role="alert"
        >
          <AlertCircle
            size={14}
            aria-hidden="true"
          />
          {errors.submit}
        </div>
      )}

      <div className="mt-8">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          loading={loading}
          className="w-full md:w-auto min-w-[200px]"
        >
          Kirim Konsultasi
        </Button>
      </div>
    </form>
  )
}

// Helper sub-components

const FormField = ({
  label,
  children,
  required,
  error,
  className = '',
}) => (
  <div
    className={`flex flex-col gap-1.5 ${className}`}
  >
    <label
      htmlFor={children?.props?.id}
      className="text-sm font-semibold text-dark"
    >
      {label}

      {required && (
        <span
          className="text-accent ml-1"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>

    {children}
  </div>
)

const ErrorMsg = ({ id, msg }) =>
  msg ? (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-xs text-accent font-medium"
    >
      <AlertCircle
        size={12}
        aria-hidden="true"
      />
      {msg}
    </p>
  ) : null

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-lg border text-sm text-dark placeholder:text-gray bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    hasError
      ? 'border-accent focus:ring-accent/30 focus:border-accent'
      : 'border-border hover:border-secondary/50'
  }`

export default ConsultationForm