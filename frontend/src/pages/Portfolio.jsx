import React, {
  useState,
  useEffect,
  useMemo,
} from 'react'

import {
  Search,
  FolderOpen,
  RefreshCw,
} from 'lucide-react'

import ProjectCard from '../components/ProjectCard.jsx'
import SectionLabel from '../components/SectionLabel.jsx'
import EmptyState from '../components/EmptyState.jsx'

import {
  portfolioService,
  normalizeProject,
} from '../data/portfolioService.js'

import {
  categories,
} from '../data/projects.js'


/*
|--------------------------------------------------------------------------
| EXTRACT BACKEND DATA
|--------------------------------------------------------------------------
*/

const extractProjects = (response) => {
  const payload = response?.data ?? response

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (
    Array.isArray(
      payload?.data?.data
    )
  ) {
    return payload.data.data
  }

  return []
}


/*
|--------------------------------------------------------------------------
| PORTFOLIO
|--------------------------------------------------------------------------
*/

const Portfolio = () => {
  const [
    activeCategory,
    setActiveCategory,
  ] = useState('Semua')

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    allProjects,
    setAllProjects,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  /*
  |--------------------------------------------------------------------------
  | LOAD PORTFOLIOS
  |--------------------------------------------------------------------------
  */

  const loadPortfolios = async () => {
    try {
      setLoading(true)
      setError('')

      const response =
        await portfolioService.getAll()

      const data =
        extractProjects(response)

      /*
      |--------------------------------------------------------------------------
      | Hanya project published
      |--------------------------------------------------------------------------
      */

      const publishedProjects = data
        .filter(
          (project) =>
            String(
              project?.status || ''
            ).toLowerCase() ===
            'published'
        )
        .map(normalizeProject)
        .filter(Boolean)

      setAllProjects(
        publishedProjects
      )
    } catch (err) {
      console.error(
        'LOAD PORTFOLIOS ERROR:',
        err
      )

      setAllProjects([])

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengambil data portfolio'
      )
    } finally {
      setLoading(false)
    }
  }


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadPortfolios()
  }, [])


  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filtered = useMemo(() => {
    let list = [
      ...allProjects,
    ]

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (
      activeCategory !== 'Semua'
    ) {
      list = list.filter(
        (project) =>
          project?.category ===
          activeCategory
      )
    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    const q =
      searchQuery
        .trim()
        .toLowerCase()

    if (q) {
      list = list.filter(
        (project) => {
          const searchable = [
            project?.title,
            project?.name,
            project?.category,
            project?.location,
            project?.design_concept,
            project?.description,
            project?.building_type,
            project?.building_area,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

          return searchable.includes(q)
        }
      )
    }

    return list
  }, [
    activeCategory,
    searchQuery,
    allProjects,
  ])


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative pt-32 pb-16 bg-gradient-to-br from-dark via-dark to-primary-dark overflow-hidden">

        <div
          className="absolute inset-0 opacity-10"
          aria-hidden="true"
        >
          <div className="absolute top-10 right-20 w-80 h-80 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container-xl relative z-10 text-center">

          <SectionLabel light>
            Portofolio
          </SectionLabel>

          <h1 className="heading-xl text-white mb-4">
            Portofolio Proyek
          </h1>

          <p className="body-lg text-white/70 max-w-xl mx-auto">
            Beberapa proyek desain yang telah kami kerjakan untuk klien di berbagai kota.
          </p>

        </div>
      </section>


      {/* =================================================
          FILTER
      ================================================= */}

      <section className="bg-white border-b border-border sticky top-16 md:top-20 z-30">

        <div className="container-xl py-4">

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

            {/* CATEGORY */}

            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter kategori"
            >

              {categories.map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        cat
                      )
                    }
                    aria-pressed={
                      activeCategory ===
                      cat
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeCategory ===
                      cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-background text-secondary hover:bg-primary-50 hover:text-primary border border-border'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}

            </div>


            {/* SEARCH */}

            <div className="relative w-full sm:w-64">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
                aria-hidden="true"
              />

              <input
                type="search"
                placeholder="Cari proyek..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                aria-label="Cari proyek"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-background border border-border rounded-lg text-dark placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          PROJECT GRID
      ================================================= */}

      <section className="pt-4 pb-16 bg-background">

        <div className="container-xl">

          {/* RESULT COUNT */}

          {!loading &&
            !error && (
              <p className="text-gray text-sm mb-6">

                Menampilkan{' '}

                <span className="font-semibold text-dark">
                  {filtered.length}
                </span>{' '}

                proyek

                {activeCategory !==
                  'Semua' && (
                  <span>
                    {' '}dalam kategori{' '}

                    <strong>
                      {activeCategory}
                    </strong>
                  </span>
                )}

              </p>
            )}


          {/* ERROR */}

          {error && (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">

              <p className="text-accent text-sm font-medium mb-4">
                {error}
              </p>

              <button
                type="button"
                onClick={loadPortfolios}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition"
              >

                <RefreshCw
                  size={15}
                />

                Coba Lagi

              </button>

            </div>
          )}


          {/* LOADING */}

          {loading &&
            !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {[1, 2, 3, 4, 5, 6].map(
                  (item) => (
                    <div
                      key={item}
                      className="bg-white rounded-2xl overflow-hidden border border-border animate-pulse"
                    >

                      <div className="h-56 bg-gray-200" />

                      <div className="p-5 space-y-3">

                        <div className="h-4 bg-gray-200 rounded w-3/4" />

                        <div className="h-3 bg-gray-200 rounded w-1/2" />

                        <div className="h-3 bg-gray-200 rounded w-2/3" />

                      </div>

                    </div>
                  )
                )}

              </div>
            )}


          {/* DATA */}

          {!loading &&
            !error &&
            filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filtered.map(
                  (project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                    />
                  )
                )}

              </div>
            )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            filtered.length === 0 && (
              <EmptyState
                icon={FolderOpen}
                title={
                  searchQuery
                    ? 'Proyek tidak ditemukan'
                    : 'Belum ada proyek'
                }
                description={
                  searchQuery
                    ? `Tidak ada proyek yang cocok dengan pencarian "${searchQuery}".`
                    : activeCategory !==
                      'Semua'
                    ? `Belum ada proyek pada kategori "${activeCategory}".`
                    : 'Proyek terbaru akan ditampilkan di sini.'
                }
                action={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchQuery(
                          ''
                        )
                      }
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Hapus pencarian
                    </button>
                  ) : activeCategory !==
                    'Semua' ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          'Semua'
                        )
                      }
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Tampilkan semua proyek
                    </button>
                  ) : null
                }
              />
            )}

        </div>

      </section>

    </main>
  )
}

export default Portfolio