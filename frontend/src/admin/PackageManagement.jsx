import React, { useState, useEffect } from 'react'
import {
  Edit2,
  X,
  Plus,
  Trash2,
  Check,
  Star
} from 'lucide-react'

import Button from '../components/Button.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { packagesService } from '../data/packagesService.js'

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-border text-sm text-dark bg-white placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-dark/60 backdrop-blur-sm overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-4 animate-slide-up">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <h2 className="font-bold text-dark text-lg">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray hover:bg-background hover:text-dark transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  </div>
)

const PackageForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    ...initial,
    features: Array.isArray(initial.features) ? initial.features : []
  })

  const [newFeature, setNewFeature] = useState('')

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addFeature = () => {
    const f = newFeature.trim()
    if (f && !form.features.includes(f)) {
      setForm((p) => ({
        ...p,
        features: [...p.features, f]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (idx) => {
    setForm((p) => ({
      ...p,
      features: p.features.filter((_, i) => i !== idx)
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      features: Array.isArray(form.features) ? form.features : []
    })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-name">
            Nama Paket
          </label>
          <input
            id="pkg-name"
            name="name"
            value={form.name || ''}
            onChange={handle}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-price">
            Harga
          </label>
          <input
            id="pkg-price"
            name="price"
            value={form.price || ''}
            onChange={handle}
            placeholder="Rp 0.000.000"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-priceNote">
            Keterangan Harga
          </label>
          <input
            id="pkg-priceNote"
            name="priceNote"
            value={form.priceNote || ''}
            onChange={handle}
            placeholder="mulai dari"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-area">
            Luas Target
          </label>
          <input
            id="pkg-area"
            name="area"
            value={form.area || ''}
            onChange={handle}
            placeholder="Untuk rumah 100–250 m²"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-description">
          Deskripsi
        </label>
        <textarea
          id="pkg-description"
          name="description"
          value={form.description || ''}
          onChange={handle}
          rows={3}
          className={inputCls + ' resize-none'}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-dark mb-2">
          Fasilitas / Fitur
        </p>

        <ul className="space-y-2 mb-3" role="list">
          {form.features.map((f, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 py-2 px-3 bg-background rounded-lg border border-border"
            >
              <Check size={14} className="text-primary shrink-0" />
              <span className="text-sm text-secondary flex-1">
                {f}
              </span>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="w-6 h-6 flex items-center justify-center rounded text-gray hover:text-accent hover:bg-red-50 transition-colors"
                aria-label={`Hapus fitur ${f}`}
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addFeature()
              }
            }}
            placeholder="Tambah fitur baru..."
            className={inputCls + ' flex-1'}
            aria-label="Nama fitur baru"
          />
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={addFeature}
          >
            <Plus size={15} />
            Tambah
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-sm font-semibold text-dark mb-1.5" htmlFor="pkg-status">
            Status
          </label>
          <select
            id="pkg-status"
            name="status"
            value={form.status || 'active'}
            onChange={handle}
            className={inputCls + ' w-36'}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <input
            type="checkbox"
            name="popular"
            checked={Boolean(form.popular)}
            onChange={handle}
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-medium text-dark">
            Paling banyak dipilih
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
        >
          Simpan Paket
        </Button>
      </div>
    </form>
  )
}

const PackageCard = ({ pkg, onEdit }) => (
  <div
    className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
      pkg.popular
        ? 'border-primary ring-2 ring-primary/20'
        : 'border-border'
    }`}
  >
    {pkg.popular && (
      <div className="absolute -top-3 left-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
          <Star size={10} fill="currentColor" />
          Populer
        </span>
      </div>
    )}

    <div className="p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-dark text-lg">
            {pkg.name}
          </h3>
          <p className="text-gray text-sm mt-0.5">
            {pkg.area}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={pkg.status} />
          <button
            onClick={() => onEdit(pkg)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-background hover:bg-primary-50 text-secondary hover:text-primary transition-colors border border-border"
            aria-label={`Edit paket ${pkg.name}`}
          >
            <Edit2 size={15} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray uppercase tracking-wide">
          {pkg.priceNote}
        </p>
        <p className="text-2xl font-extrabold text-dark">
          {pkg.price}
        </p>
      </div>

      <p className="text-secondary text-sm leading-relaxed mb-4">
        {pkg.description}
      </p>

      <ul className="space-y-2" role="list">
        {(Array.isArray(pkg.features) ? pkg.features : []).map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-secondary"
          >
            <Check
              size={14}
              className="text-primary mt-0.5 shrink-0"
              aria-hidden="true"
            />
            {f}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const PackageManagement = () => {
  const [pkgs, setPkgs] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await packagesService.getAll()
      setPkgs(data)
    } catch (error) {
      console.error('Gagal mengambil packages:', error)
      setError(error.message || 'Gagal mengambil data paket')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  const handleSave = async (form) => {
    try {
      setSaving(true)
      setError('')
      await packagesService.update(editing.id, form)
      await reload()
      setEditing(null)
    } catch (error) {
      console.error('Gagal menyimpan paket:', error)
      setError(error.message || 'Gagal menyimpan paket')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Manajemen Paket Harga
          </h1>
          <p className="text-gray text-sm mt-1">
            Edit harga, deskripsi, dan fitur setiap paket desain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border border-border p-6 animate-pulse"
            >
              <div className="h-5 bg-background rounded w-32 mb-3" />
              <div className="h-3 bg-background rounded w-48 mb-6" />
              <div className="h-8 bg-background rounded w-40 mb-6" />
              <div className="space-y-3">
                <div className="h-3 bg-background rounded" />
                <div className="h-3 bg-background rounded" />
                <div className="h-3 bg-background rounded" />
                <div className="h-3 bg-background rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-dark">
          Manajemen Paket Harga
        </h1>
        <p className="text-gray text-sm mt-1">
          Edit harga, deskripsi, dan fitur setiap paket desain.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pkgs.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onEdit={setEditing}
          />
        ))}
      </div>

      {pkgs.length === 0 && !loading && (
        <div className="bg-white border border-border rounded-2xl p-10 text-center">
          <p className="text-gray">
            Belum ada paket harga.
          </p>
        </div>
      )}

      {editing && (
        <Modal
          title={`Edit Paket: ${editing.name}`}
          onClose={() => setEditing(null)}
        >
          <PackageForm
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            loading={saving}
          />
        </Modal>
      )}
    </div>
  )
}

export default PackageManagement