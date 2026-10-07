import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
})

export const resolveImageUrl = (image) => {
  if (!image) {
    return ''
  }

  const value = String(image).trim()

  if (!value) {
    return ''
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('data:') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  if (value.startsWith('//')) {
    return `${window.location.protocol}${value}`
  }

  const backendUrl = API_URL.replace(/\/api\/?$/, '')

  if (value.startsWith('/')) {
    return `${backendUrl}${value}`
  }

  return `${backendUrl}/${value}`
}

export const getProjectImage = (project) => {
  if (!project) {
    return ''
  }

  return (
    project.cover_image ||
    project.coverImage ||
    project.thumbnail ||
    project.thumbnail_url ||
    project.image ||
    project.image_url ||
    project.imageUrl ||
    project.photo ||
    project.photo_url ||
    ''
  )
}

export const getProjectGallery = (project) => {
  if (!project) {
    return []
  }

  let gallery =
    project.gallery ||
    project.images ||
    project.gallery_images ||
    []

  if (typeof gallery === 'string') {
    try {
      gallery = JSON.parse(gallery)
    } catch {
      gallery = gallery
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  if (!Array.isArray(gallery)) {
    return []
  }

  return gallery
    .map((item) => {
      if (typeof item === 'string') {
        return item
      }

      if (item && typeof item === 'object') {
        return (
          item.url ||
          item.image ||
          item.image_url ||
          item.path ||
          item.src ||
          ''
        )
      }

      return ''
    })
    .filter(Boolean)
}

export const normalizeProject = (project) => {
  if (!project) {
    return null
  }

  const image = getProjectImage(project)
  const gallery = getProjectGallery(project)

  const allImages = [
    image,
    ...gallery,
  ]
    .filter(Boolean)
    .map(resolveImageUrl)

  const uniqueImages = [
    ...new Set(allImages),
  ]

  const title =
    project.title ||
    project.name ||
    project.project_name ||
    ''

  const category = project.category || ''
  const location = project.location || ''

  const designConcept =
    project.design_concept ||
    project.designConcept ||
    project.concept ||
    ''

  const buildingType =
    project.building_type ||
    project.buildingType ||
    ''

  const buildingArea =
    project.building_area ||
    project.buildingArea ||
    project.area ||
    ''

  const subtitle =
    project.subtitle ||
    project.sub_title ||
    designConcept ||
    buildingType ||
    category ||
    ''

  return {
    ...project,
    id: project.id,
    title,
    name: title,
    category,
    location,
    description: project.description || '',
    subtitle,
    design_concept: designConcept,
    designConcept,
    concept: designConcept,
    building_type: buildingType,
    buildingType,
    building_area: buildingArea,
    buildingArea,
    area: buildingArea,
    thumbnail: image ? resolveImageUrl(image) : '',
    coverImage: image ? resolveImageUrl(image) : '',
    cover_image: image ? resolveImageUrl(image) : '',
    image: image ? resolveImageUrl(image) : '',
    gallery: uniqueImages,
    images: uniqueImages,
    status: project.status || 'draft',
    featured: Boolean(project.featured),
    created_at: project.created_at || project.createdAt || null,
    updated_at: project.updated_at || project.updatedAt || null,
  }
}

export const extractProjects = (response) => {
  const payload = response?.data ?? response

  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data
  }

  return []
}

export const portfolioService = {
  async getAll() {
    const response = await api.get('/portfolios')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/portfolios/${id}`)
    return response.data
  },

  async create(payload) {
    const isFormData =
      typeof FormData !== 'undefined' &&
      payload instanceof FormData

    const response = await api.post('/portfolios', payload)
    return response.data
  },

  async update(id, payload) {
    const isFormData =
      typeof FormData !== 'undefined' &&
      payload instanceof FormData

    // Laravel membutuhkan _method=PUT ketika update sekaligus upload file via FormData
    if (isFormData) {
      payload.append('_method', 'PUT')
      const response = await api.post(`/portfolios/${id}`, payload)
      return response.data
    }

    const response = await api.put(`/portfolios/${id}`, payload)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/portfolios/${id}`)
    return response.data
  },
}

export default portfolioService