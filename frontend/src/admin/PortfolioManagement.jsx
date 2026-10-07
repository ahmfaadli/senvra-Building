import React, { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  ImagePlus,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

import Button from '../components/Button.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { portfolioService } from '../data/portfolioService.js'
import { categories } from '../data/projects.js'

/* =========================================================
   EMPTY FORM
========================================================= */

const EMPTY_FORM = {
  title: '',
  category: '',
  location: '',
  building_area: '',
  description: '',
  thumbnail: '',
  design_concept: '',
  building_type: 'Hunian',
  status: 'draft',
  featured: false
}

/* =========================================================
   NORMALIZE RESPONSE
========================================================= */

const extractProjects = (response) => {
  // Jika langsung array
  if (Array.isArray(response)) {
    return response
  }

  // Jika { data: [...] }
  if (Array.isArray(response?.data)) {
    return response.data
  }

  // Jika { data: { data: [...] } }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  return []
}

/* =========================================================
   MODAL
========================================================= */

const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-dark/60 backdrop-blur-sm overflow-y-auto"
    role="dialog"
    aria-modal="true"
    aria-label={title}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 animate-slide-up">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <h2 className="font-bold text-dark text-lg">
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray hover:bg-background hover:text-dark transition-colors"
          aria-label="Tutup modal"
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

/* =========================================================
   INPUT CLASS
========================================================= */

const inputCls =
  'w-full px-4 py-2.5 rounded-lg border border-border text-sm text-dark bg-white placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'

/* =========================================================
   PROJECT FORM
========================================================= */

const ProjectForm = ({
  initial,
  onSave,
  onCancel,
  loading
}) => {
  const [form, setForm] = useState(
    initial || EMPTY_FORM
  )

  useEffect(() => {
    setForm(initial || EMPTY_FORM)
  }, [initial])

  const handle = (e) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value
    }))
  }

  const submit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4"
    >
      {/* GRID FORM */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* TITLE */}

        <div>
          <label
            htmlFor="p-title"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Nama Proyek{' '}
            <span className="text-accent">*</span>
          </label>

          <input
            id="p-title"
            name="title"
            value={form.title}
            onChange={handle}
            required
            placeholder="Contoh: Modern House Cibinong"
            className={inputCls}
          />
        </div>

        {/* CATEGORY */}

        <div>
          <label
            htmlFor="p-category"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Kategori{' '}
            <span className="text-accent">*</span>
          </label>

          <select
            id="p-category"
            name="category"
            value={form.category}
            onChange={handle}
            required
            className={inputCls}
          >
            <option value="">
              Pilih kategori
            </option>

            {categories
              .filter((c) => c !== 'Semua')
              .map((c) => (
                <option
                  key={c}
                  value={c}
                >
                  {c}
                </option>
              ))}
          </select>
        </div>

        {/* LOCATION */}

        <div>
          <label
            htmlFor="p-location"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Lokasi
          </label>

          <input
            id="p-location"
            name="location"
            value={form.location}
            onChange={handle}
            placeholder="Contoh: Bogor, Jawa Barat"
            className={inputCls}
          />
        </div>

        {/* BUILDING AREA */}

        <div>
          <label
            htmlFor="p-building-area"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Luas Bangunan
          </label>

          <input
            id="p-building-area"
            name="building_area"
            value={form.building_area}
            onChange={handle}
            placeholder="Contoh: 150 m²"
            className={inputCls}
          />
        </div>

        {/* DESIGN CONCEPT */}

        <div>
          <label
            htmlFor="p-design-concept"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Konsep Desain
          </label>

          <input
            id="p-design-concept"
            name="design_concept"
            value={form.design_concept}
            onChange={handle}
            placeholder="Contoh: Modern Minimalist"
            className={inputCls}
          />
        </div>

        {/* BUILDING TYPE */}

        <div>
          <label
            htmlFor="p-building-type"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Jenis Bangunan
          </label>

          <select
            id="p-building-type"
            name="building_type"
            value={form.building_type}
            onChange={handle}
            className={inputCls}
          >
            {[
              'Hunian',
              'Villa',
              'Komersial',
              'Lainnya'
            ].map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THUMBNAIL */}

      <div>
        <label
          htmlFor="p-thumbnail"
          className="block text-sm font-semibold text-dark mb-1.5"
        >
          URL Foto Cover
        </label>

        <input
          id="p-thumbnail"
          name="thumbnail"
          value={form.thumbnail}
          onChange={handle}
          placeholder="https://images.unsplash.com/..."
          className={inputCls}
        />

        {form.thumbnail && (
          <img
            src={form.thumbnail}
            alt="Preview"
            className="mt-2 h-24 w-full object-cover rounded-lg border border-border"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>

      {/* DESCRIPTION */}

      <div>
        <label
          htmlFor="p-description"
          className="block text-sm font-semibold text-dark mb-1.5"
        >
          Deskripsi
        </label>

        <textarea
          id="p-description"
          name="description"
          value={form.description}
          onChange={handle}
          rows={3}
          placeholder="Deskripsi singkat proyek..."
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* STATUS + FEATURED */}

      <div className="flex flex-wrap items-center gap-6">

        {/* STATUS */}

        <div>
          <label
            htmlFor="p-status"
            className="block text-sm font-semibold text-dark mb-1.5"
          >
            Status
          </label>

          <select
            id="p-status"
            name="status"
            value={form.status}
            onChange={handle}
            className={`${inputCls} w-40`}
          >
            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>
          </select>
        </div>

        {/* FEATURED */}

        <label className="flex items-center gap-2 cursor-pointer mt-5">
          <input
            type="checkbox"
            name="featured"
            checked={Boolean(form.featured)}
            onChange={handle}
            className="w-4 h-4 accent-primary rounded"
          />

          <span className="text-sm font-medium text-dark">
            Featured di homepage
          </span>
        </label>
      </div>

      {/* BUTTON */}

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
          Simpan Proyek
        </Button>
      </div>
    </form>
  )
}

/* =========================================================
   DELETE CONFIRM
========================================================= */

const DeleteConfirm = ({
  project,
  onConfirm,
  onCancel,
  loading
}) => (
  <div className="text-center py-4">

    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertTriangle
        size={24}
        className="text-accent"
      />
    </div>

    <h3 className="font-bold text-dark text-lg mb-2">
      Hapus Proyek?
    </h3>

    <p className="text-secondary text-sm mb-6">
      Apakah Anda yakin ingin menghapus proyek{' '}
      <strong>
        {project?.title}
      </strong>
      ?
      <br />
      Tindakan ini tidak dapat dibatalkan.
    </p>

    <div className="flex justify-center gap-3">
      <Button
        variant="ghost"
        size="md"
        onClick={onCancel}
        disabled={loading}
      >
        Batal
      </Button>

      <Button
        variant="danger"
        size="md"
        onClick={onConfirm}
        loading={loading}
      >
        Ya, Hapus
      </Button>
    </div>
  </div>
)

/* =========================================================
   PORTFOLIO MANAGEMENT
========================================================= */

const PortfolioManagement = () => {
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const [saving, setSaving] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  const [filterStatus, setFilterStatus] =
    useState('all')

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const reload = async () => {
    try {
      setLoadingData(true)

      const response =
        await portfolioService.getAll()

      const data = extractProjects(response)

      setProjects(data)
    } catch (error) {
      console.error(
        'LOAD PORTFOLIOS ERROR:',
        error
      )

      setProjects([])

      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Gagal mengambil data portfolio'
      )
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered =
    filterStatus === 'all'
      ? projects
      : projects.filter(
          (project) =>
            project.status === filterStatus
        )

  /* =======================================================
     MODAL
  ======================================================= */

  const openAdd = () => {
    setSelected(null)
    setModal('add')
  }

  const openEdit = (project) => {
    setSelected(project)
    setModal('edit')
  }

  const openDelete = (project) => {
    setSelected(project)
    setModal('delete')
  }

  const closeModal = () => {
    if (saving) return

    setModal(null)
    setSelected(null)
  }

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async (form) => {
    try {
      setSaving(true)

      const payload = {
        title:
          form.title?.trim(),

        category:
          form.category?.trim(),

        location:
          form.location?.trim() || null,

        building_area:
          form.building_area?.trim() || null,

        design_concept:
          form.design_concept?.trim() || null,

        building_type:
          form.building_type || null,

        thumbnail:
          form.thumbnail?.trim() || null,

        description:
          form.description?.trim() || null,

        status:
          form.status || 'draft',

        featured:
          Boolean(form.featured)
      }

      if (modal === 'add') {
        await portfolioService.create(
          payload
        )
      }

      if (
        modal === 'edit' &&
        selected?.id
      ) {
        await portfolioService.update(
          selected.id,
          payload
        )
      }

      await reload()

      closeModal()
    } catch (error) {
      console.error(
        'SAVE PORTFOLIO ERROR:',
        error
      )

      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Gagal menyimpan portfolio'
      )
    } finally {
      setSaving(false)
    }
  }

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async () => {
    if (!selected?.id) {
      return
    }

    try {
      setSaving(true)

      await portfolioService.delete(
        selected.id
      )

      await reload()

      closeModal()
    } catch (error) {
      console.error(
        'DELETE PORTFOLIO ERROR:',
        error
      )

      alert(
        error?.response?.data?.message ||
        error?.message ||
        'Gagal menghapus portfolio'
      )
    } finally {
      setSaving(false)
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl font-extrabold text-dark">
            Manajemen Portofolio
          </h1>

          <p className="text-gray text-sm mt-1">
            {projects.length} total proyek
          </p>
        </div>

        <div className="flex gap-2">

          <Button
            variant="ghost"
            size="md"
            onClick={reload}
            disabled={loadingData}
          >
            <RefreshCw
              size={15}
              className={
                loadingData
                  ? 'animate-spin'
                  : ''
              }
            />

            Refresh
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={openAdd}
          >
            <Plus size={16} />
            Tambah Proyek
          </Button>

        </div>
      </div>

      {/* FILTER */}

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter status"
      >
        {[
          {
            v: 'all',
            l: 'Semua'
          },
          {
            v: 'published',
            l: 'Published'
          },
          {
            v: 'draft',
            l: 'Draft'
          }
        ].map(({ v, l }) => (
          <button
            key={v}
            type="button"
            onClick={() =>
              setFilterStatus(v)
            }
            aria-pressed={
              filterStatus === v
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === v
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-secondary hover:bg-background'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">

        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm text-gray">
              <RefreshCw
                size={16}
                className="animate-spin"
              />
              Memuat data portfolio...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ImagePlus}
            title="Belum ada proyek"
            description={
              filterStatus === 'all'
                ? 'Proyek terbaru akan ditampilkan di sini setelah Anda menambahkannya.'
                : `Tidak ada proyek dengan status ${
                    filterStatus === 'published'
                      ? 'Published'
                      : 'Draft'
                  }.`
            }
            action={
              <Button
                variant="primary"
                size="md"
                onClick={openAdd}
              >
                <Plus size={14} />
                Tambah Proyek
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead>
                <tr className="bg-background border-b border-border">

                  {[
                    'Foto',
                    'Nama',
                    'Kategori',
                    'Lokasi',
                    'Luas',
                    'Status',
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

                {filtered.map(
                  (project, index) => (
                    <tr
                      key={project.id}
                      className={`hover:bg-background/50 transition-colors ${
                        index <
                        filtered.length - 1
                          ? 'border-b border-border'
                          : ''
                      }`}
                    >

                      {/* FOTO */}

                      <td className="px-5 py-4">

                        {project.thumbnail ? (
                          <img
                            src={
                              project.thumbnail
                            }
                            alt={
                              project.title
                            }
                            className="w-12 h-10 object-cover rounded-lg border border-border"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none'
                            }}
                          />
                        ) : (
                          <div className="w-12 h-10 bg-background rounded-lg border border-border flex items-center justify-center">
                            <ImagePlus
                              size={14}
                              className="text-gray"
                            />
                          </div>
                        )}

                      </td>

                      {/* NAMA */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-dark text-sm">
                          {project.title}
                        </p>

                        {Boolean(
                          project.featured
                        ) && (
                          <span className="text-xs text-primary font-medium">
                            ★ Featured
                          </span>
                        )}

                      </td>

                      {/* CATEGORY */}

                      <td className="px-5 py-4 text-sm text-secondary">
                        {project.category ||
                          '—'}
                      </td>

                      {/* LOCATION */}

                      <td className="px-5 py-4 text-sm text-secondary">
                        {project.location ||
                          '—'}
                      </td>

                      {/* AREA */}

                      <td className="px-5 py-4 text-sm text-secondary">
                        {project.building_area ||
                          '—'}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            project.status
                          }
                        />

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          {/* PREVIEW */}

                          <a
                            href={`/portfolio/${project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-primary-50 text-gray hover:text-primary transition-colors"
                            aria-label={`Preview ${project.title}`}
                          >
                            <Eye size={15} />
                          </a>

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                project
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-primary-50 text-gray hover:text-primary transition-colors"
                            aria-label={`Edit ${project.title}`}
                          >
                            <Edit2
                              size={15}
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              openDelete(
                                project
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-background hover:bg-red-50 text-gray hover:text-accent transition-colors"
                            aria-label={`Hapus ${project.title}`}
                          >
                            <Trash2
                              size={15}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ADD MODAL */}

      {modal === 'add' && (
        <Modal
          title="Tambah Proyek Baru"
          onClose={closeModal}
        >
          <ProjectForm
            initial={EMPTY_FORM}
            onSave={handleSave}
            onCancel={closeModal}
            loading={saving}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}

      {modal === 'edit' &&
        selected && (
          <Modal
            title={`Edit: ${selected.title}`}
            onClose={closeModal}
          >
            <ProjectForm
              initial={{
                title:
                  selected.title || '',

                category:
                  selected.category || '',

                location:
                  selected.location || '',

                building_area:
                  selected.building_area ||
                  '',

                description:
                  selected.description ||
                  '',

                thumbnail:
                  selected.thumbnail || '',

                design_concept:
                  selected.design_concept ||
                  '',

                building_type:
                  selected.building_type ||
                  'Hunian',

                status:
                  selected.status ||
                  'draft',

                featured:
                  Boolean(
                    selected.featured
                  )
              }}
              onSave={handleSave}
              onCancel={closeModal}
              loading={saving}
            />
          </Modal>
        )}

      {/* DELETE MODAL */}

      {modal === 'delete' &&
        selected && (
          <Modal
            title="Konfirmasi Hapus"
            onClose={closeModal}
          >
            <DeleteConfirm
              project={selected}
              onConfirm={handleDelete}
              onCancel={closeModal}
              loading={saving}
            />
          </Modal>
        )}

    </div>
  )
}

export default PortfolioManagement