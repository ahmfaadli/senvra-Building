import React, { useEffect, useMemo, useState } from 'react'
import {
  MapPin,
  Maximize2,
  Building2,
  Palette,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import { useParams, Link, Navigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { portfolioService } from '../data/portfolioService.js'

/* =========================================================
   IMAGE URL HELPER
========================================================= */

/**
 * Normalisasi URL gambar dari backend.
 *
 * Mendukung:
 * - https://domain.com/storage/xxx.jpg
 * - http://domain.com/storage/xxx.jpg
 * - /storage/xxx.jpg
 * - storage/xxx.jpg
 * - portfolios/xxx.jpg
 * - xxx.jpg
 */
const getImageUrl = (image) => {
  if (!image) return ''

  // Kalau bukan string
  if (typeof image !== 'string') {
    return ''
  }

  let value = image.trim()

  if (!value) {
    return ''
  }

  // JSON string
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    try {
      value = JSON.parse(value)
    } catch {
      value = value.slice(1, -1)
    }
  }

  if (!value || typeof value !== 'string') {
    return ''
  }

  // URL lengkap
  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:') ||
    value.startsWith('data:')
  ) {
    return value
  }

  // Ambil base URL API dari environment
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    ''

  const baseUrl = apiUrl.replace(/\/+$/, '')

  // Path absolut dari backend
  if (value.startsWith('/')) {
    // Jika API URL tersedia
    if (baseUrl) {
      return `${baseUrl}${value}`
    }

    // Jika backend dan frontend satu domain
    return value
  }

  // Hilangkan slash awal
  value = value.replace(/^\/+/, '')

  // Kalau sudah diawali storage/
  if (value.startsWith('storage/')) {
    if (baseUrl) {
      return `${baseUrl}/${value}`
    }

    return `/${value}`
  }

  // Kalau backend mengirim path portfolios/...
  if (
    value.startsWith('portfolios/') ||
    value.startsWith('portfolio/')
  ) {
    if (baseUrl) {
      return `${baseUrl}/storage/${value}`
    }

    return `/storage/${value}`
  }

  // Default:
  // anggap file berada di storage Laravel
  if (baseUrl) {
    return `${baseUrl}/storage/${value}`
  }

  return `/storage/${value}`
}

/* =========================================================
   EXTRACT BACKEND DATA
========================================================= */

const extractData = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data
  }

  if (response?.data?.data !== undefined) {
    return response.data.data
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (response?.data !== undefined) {
    return response.data
  }

  return response
}

/* =========================================================
   NORMALIZE GALLERY
========================================================= */

const normalizeGallery = (project) => {
  if (!project) {
    return []
  }

  const gallerySource =
    project.gallery ??
    project.gallery_images ??
    project.images ??
    project.photos ??
    []

  let gallery = []

  if (Array.isArray(gallerySource)) {
    gallery = gallerySource
  } else if (typeof gallerySource === 'string') {
    const value = gallerySource.trim()

    if (!value) {
      return []
    }

    try {
      const parsed = JSON.parse(value)

      if (Array.isArray(parsed)) {
        gallery = parsed
      } else if (typeof parsed === 'string') {
        gallery = [parsed]
      }
    } catch {
      gallery = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return gallery
    .map((item) => {
      // Kalau gallery berupa object
      if (typeof item === 'object' && item !== null) {
        return (
          item.url ||
          item.path ||
          item.image ||
          item.image_url ||
          item.filename ||
          item.file ||
          ''
        )
      }

      return item
    })
    .map(getImageUrl)
    .filter(Boolean)
}

/* =========================================================
   GET COVER IMAGE
========================================================= */

const getCoverImage = (project) => {
  if (!project) {
    return ''
  }

  const possibleCoverImages = [
    project.thumbnail,
    project.coverImage,
    project.cover_image,
    project.cover,
    project.image,
    project.image_url,
    project.featured_image,
    project.featuredImage,
  ]

  for (const image of possibleCoverImages) {
    const normalized = getImageUrl(image)

    if (normalized) {
      return normalized
    }
  }

  return ''
}

/* =========================================================
   NORMALIZE PROJECT
========================================================= */

const normalizeProjectForCard = (project) => {
  if (!project) {
    return null
  }

  const coverImage = getCoverImage(project)
  const gallery = normalizeGallery(project)

  return {
    ...project,

    id: project.id,

    title: project.title ?? project.name ?? '',

    category: project.category ?? '',

    location: project.location ?? '',

    building_area:
      project.building_area ??
      project.buildingArea ??
      project.area ??
      '',

    description: project.description ?? '',

    thumbnail: coverImage,

    design_concept:
      project.design_concept ??
      project.concept ??
      '',

    building_type:
      project.building_type ??
      project.buildingType ??
      '',

    status: project.status ?? 'draft',

    featured: Boolean(project.featured),

    // Compatibility ProjectCard lama
    name: project.title ?? project.name ?? '',

    coverImage,

    area:
      project.building_area ??
      project.buildingArea ??
      project.area ??
      '',

    concept:
      project.design_concept ??
      project.concept ??
      '',

    buildingType:
      project.building_type ??
      project.buildingType ??
      '',

    subtitle:
      project.design_concept ||
      project.building_type ||
      project.category ||
      '',

    gallery,
  }
}

/* =========================================================
   LIGHTBOX
========================================================= */

const Lightbox = ({
  images,
  current,
  onClose,
  onPrev,
  onNext,
}) => {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-dark/95 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
      onClick={onClose}
    >
      {/* CLOSE */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label="Tutup galeri"
      >
        <X size={20} />
      </button>

      {/* PREVIOUS */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Foto sebelumnya"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* IMAGE */}
      <img
        src={images[current]}
        alt={`Foto ${current + 1} dari ${images.length}`}
        className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />

      {/* NEXT */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Foto berikutnya"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current
                  ? 'bg-white'
                  : 'bg-white/30'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   PROJECT DETAIL
========================================================= */

const ProjectDetail = () => {
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [relatedProjects, setRelatedProjects] = useState([])

  /* =======================================================
     LOAD PROJECT
  ======================================================= */

  useEffect(() => {
    let mounted = true

    const loadProject = async () => {
      try {
        setLoading(true)
        setNotFound(false)

        const response =
          await portfolioService.getById(id)

        const data = extractData(response)

        if (!mounted) return

        if (!data || typeof data !== 'object') {
          setProject(null)
          setNotFound(true)
          return
        }

        // Jangan tampilkan draft
        if (
          data.status &&
          data.status !== 'published'
        ) {
          setProject(null)
          setNotFound(true)
          return
        }

        setProject(data)
      } catch (error) {
        console.error(
          'LOAD PORTFOLIO DETAIL ERROR:',
          error
        )

        if (mounted) {
          setProject(null)
          setNotFound(true)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    if (id) {
      loadProject()
    } else {
      setLoading(false)
      setNotFound(true)
    }

    return () => {
      mounted = false
    }
  }, [id])

  /* =======================================================
     NORMALIZED PROJECT
  ======================================================= */

  const displayProject = useMemo(() => {
    return normalizeProjectForCard(project)
  }, [project])

  /* =======================================================
     IMAGES
  ======================================================= */

  const uniqueImages = useMemo(() => {
    if (!project) {
      return []
    }

    const cover = getCoverImage(project)

    const gallery = normalizeGallery(project)

    const allImages = [
      cover,
      ...gallery,
    ].filter(Boolean)

    return [...new Set(allImages)]
  }, [project])

  /* =======================================================
     LIGHTBOX
  ======================================================= */

  const openLightbox = (idx) => {
    setLightbox(idx)
  }

  const closeLightbox = () => {
    setLightbox(null)
  }

  const prevImage = () => {
    setLightbox((current) => {
      if (
        current === null ||
        uniqueImages.length === 0
      ) {
        return current
      }

      return (
        (current - 1 + uniqueImages.length) %
        uniqueImages.length
      )
    })
  }

  const nextImage = () => {
    setLightbox((current) => {
      if (
        current === null ||
        uniqueImages.length === 0
      ) {
        return current
      }

      return (
        (current + 1) %
        uniqueImages.length
      )
    })
  }

  /* =======================================================
     KEYBOARD NAVIGATION
  ======================================================= */

  useEffect(() => {
    if (lightbox === null) {
      return
    }

    const handler = (e) => {
      if (e.key === 'ArrowLeft') {
        prevImage()
      }

      if (e.key === 'ArrowRight') {
        nextImage()
      }

      if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener(
      'keydown',
      handler
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handler
      )
    }
  }, [lightbox, uniqueImages.length])

  /* =======================================================
     RELATED PROJECTS
  ======================================================= */

  useEffect(() => {
    let mounted = true

    const loadRelatedProjects = async () => {
      if (!project) {
        return
      }

      try {
        const response =
          await portfolioService.getAll()

        const data = extractData(response)

        if (!Array.isArray(data)) {
          return
        }

        const related = data
          .filter(
            (item) =>
              item?.status === 'published' &&
              String(item?.id) !==
                String(project?.id) &&
              item?.category ===
                project?.category
          )
          .slice(0, 3)
          .map(normalizeProjectForCard)
          .filter(Boolean)

        if (mounted) {
          setRelatedProjects(related)
        }
      } catch (error) {
        console.error(
          'LOAD RELATED PORTFOLIOS ERROR:',
          error
        )

        if (mounted) {
          setRelatedProjects([])
        }
      }
    }

    loadRelatedProjects()

    return () => {
      mounted = false
    }
  }, [project])

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main>
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-background animate-pulse">
          <div className="absolute inset-0 bg-gray-200" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container-xl">
              <div className="h-4 bg-gray-300 rounded w-32 mb-4" />
              <div className="h-4 bg-gray-300 rounded w-24 mb-3" />
              <div className="h-10 bg-gray-300 rounded w-80" />
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-5">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-8 bg-gray-200 rounded w-72" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>

              <div className="h-72 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (notFound || !displayProject) {
    return (
      <Navigate
        to="/portfolio"
        replace
      />
    )
  }

  /* =======================================================
     PROJECT META
  ======================================================= */

  const meta = [
    {
      icon: MapPin,
      label: 'Lokasi',
      value:
        displayProject.location || '—',
    },
    {
      icon: Building2,
      label: 'Tipe Bangunan',
      value:
        displayProject.building_type ||
        '—',
    },
    {
      icon: Maximize2,
      label: 'Luas Bangunan',
      value:
        displayProject.building_area ||
        '—',
    },
    {
      icon: Palette,
      label: 'Konsep Desain',
      value:
        displayProject.design_concept ||
        '—',
    },
  ]

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main>
      {/* ===================================================
          HERO IMAGE
      =================================================== */}

      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {displayProject.thumbnail ? (
          <img
            src={displayProject.thumbnail}
            alt={`Foto utama proyek ${displayProject.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(
                'Gagal memuat cover image:',
                displayProject.thumbnail
              )

              e.currentTarget.style.display =
                'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />

        {/* Breadcrumb + Title overlay */}

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container-xl">
            {/* Breadcrumb */}

            <nav
              aria-label="Breadcrumb"
              className="mb-3"
            >
              <ol className="flex items-center gap-2 text-sm text-white/60">
                <li>
                  <Link
                    to="/"
                    className="hover:text-white transition-colors"
                  >
                    Beranda
                  </Link>
                </li>

                <li aria-hidden="true">
                  /
                </li>

                <li>
                  <Link
                    to="/portfolio"
                    className="hover:text-white transition-colors"
                  >
                    Portofolio
                  </Link>
                </li>

                <li aria-hidden="true">
                  /
                </li>

                <li className="text-white font-medium">
                  {displayProject.title}
                </li>
              </ol>
            </nav>

            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
              {displayProject.category}
            </span>

            <h1 className="heading-lg text-white">
              {displayProject.title}
            </h1>

            <p className="text-white/70 mt-1">
              {displayProject.design_concept ||
                displayProject.building_type ||
                displayProject.category}
            </p>
          </div>
        </div>
      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="section-padding bg-white">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="lg:col-span-2">
              {/* Back link */}

              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-sm text-gray hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={16} />
                Kembali ke Portofolio
              </Link>

              <SectionLabel>
                Deskripsi Proyek
              </SectionLabel>

              <h2 className="heading-md text-dark mb-4">
                {displayProject.title}
              </h2>

              <p className="text-secondary body-md leading-relaxed">
                {displayProject.description ||
                  'Belum ada deskripsi untuk proyek ini.'}
              </p>

              {/* =================================================
                  GALLERY
              ================================================= */}

              {uniqueImages.length > 1 && (
                <div className="mt-10">
                  <h3 className="font-bold text-dark mb-5">
                    Galeri Foto
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uniqueImages.map(
                      (img, idx) => (
                        <button
                          key={`${img}-${idx}`}
                          type="button"
                          onClick={() =>
                            openLightbox(idx)
                          }
                          className="group relative overflow-hidden rounded-xl aspect-square focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                          aria-label={`Buka foto ${
                            idx + 1
                          } dalam tampilan penuh`}
                        >
                          <img
                            src={img}
                            alt={`Foto proyek ${
                              displayProject.title
                            } ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                            onError={(e) => {
                              console.error(
                                'Gagal memuat gallery:',
                                img
                              )

                              e.currentTarget.style.display =
                                'none'
                            }}
                          />

                          <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors duration-200 flex items-center justify-center">
                            <Maximize2
                              size={20}
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* =================================================
                  CTA
              ================================================= */}

              <div className="mt-12 p-8 bg-primary-50 rounded-2xl border border-primary/20 text-center">
                <h3 className="heading-sm text-dark mb-2">
                  Tertarik dengan konsep ini?
                </h3>

                <p className="text-secondary text-sm mb-6">
                  Konsultasikan kebutuhan desain
                  rumah Anda bersama tim Senvra
                  Arsitektur Studio.
                </p>

                <Button
                  as={Link}
                  to="/consultation"
                  size="lg"
                  variant="primary"
                >
                  Konsultasi Gratis
                </Button>
              </div>
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <div>
              <div className="bg-background rounded-2xl border border-border p-6 sticky top-28">
                <h3 className="font-bold text-dark mb-5">
                  Informasi Proyek
                </h3>

                <ul className="space-y-4">
                  {meta.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon
                          size={16}
                          className="text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray font-medium uppercase tracking-wide">
                          {item.label}
                        </p>

                        <p className="text-dark font-semibold text-sm mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <Button
                    as={Link}
                    to="/consultation"
                    size="md"
                    variant="primary"
                    className="w-full"
                  >
                    Konsultasi Gratis
                  </Button>

                  <Button
                    as={Link}
                    to="/portfolio"
                    size="md"
                    variant="ghost"
                    className="w-full"
                  >
                    Lihat Proyek Lain
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RELATED PROJECTS
          ================================================= */}

          {relatedProjects.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="heading-md text-dark">
                  Proyek Serupa
                </h2>

                <Button
                  as={Link}
                  to="/portfolio"
                  size="sm"
                  variant="ghost"
                >
                  Lihat Semua
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          LIGHTBOX
      =================================================== */}

      {lightbox !== null &&
        uniqueImages.length > 0 && (
          <Lightbox
            images={uniqueImages}
            current={lightbox}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
    </main>
  )
}

export default ProjectDetail