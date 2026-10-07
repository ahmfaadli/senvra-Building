import axios from 'axios'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

const getData = (response) => {
  const data = response?.data

  if (data?.data !== undefined) {
    return data.data
  }

  return data
}

const getArray = (response) => {
  const data = response?.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(data?.leads)) {
    return data.leads
  }

  return []
}

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

export const leadsService = {
  async getAll() {
    try {
      const response = await api.get('/leads')

      return getArray(response)
    } catch (error) {
      console.error(
        'GET /leads error:',
        error?.response?.data || error
      )

      throw new Error(
        getErrorMessage(
          error,
          'Gagal mengambil data leads.'
        )
      )
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/leads/${id}`)

      return getData(response)
    } catch (error) {
      console.error(
        `GET /leads/${id} error:`,
        error?.response?.data || error
      )

      throw new Error(
        getErrorMessage(
          error,
          'Gagal mengambil detail lead.'
        )
      )
    }
  },

  async create(data) {
    const payload = {
      name: String(data?.name || '').trim(),
      whatsapp: String(data?.whatsapp || '').trim(),
      email: String(data?.email || '').trim(),
      area: String(data?.area || '').trim(),
      buildingType: data?.buildingType || '',
      packageId: data?.packageId || '',
      message: String(data?.message || '').trim(),
    }

    try {
      console.log('POST /leads payload:', payload)

      const response = await api.post('/leads', payload)

      console.log(
        'POST /leads response:',
        response?.data
      )

      return getData(response)
    } catch (error) {
      console.error(
        'POST /leads error:',
        error?.response?.data || error
      )

      throw error
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await api.patch(
        `/leads/${id}/status`,
        {
          status,
        }
      )

      return getData(response)
    } catch (error) {
      console.error(
        `PATCH /leads/${id}/status error:`,
        error?.response?.data || error
      )

      throw new Error(
        getErrorMessage(
          error,
          'Gagal mengubah status lead.'
        )
      )
    }
  },

  async delete(id) {
    try {
      await api.delete(`/leads/${id}`)

      return true
    } catch (error) {
      console.error(
        `DELETE /leads/${id} error:`,
        error?.response?.data || error
      )

      throw new Error(
        getErrorMessage(
          error,
          'Gagal menghapus lead.'
        )
      )
    }
  },

  async getStats() {
    try {
      const response = await api.get('/leads/stats')

      const data =
        response?.data?.data ||
        response?.data ||
        {}

      return {
        total: Number(data?.total || 0),

        newLeads: Number(
          data?.newLeads ??
          data?.new_leads ??
          data?.baru ??
          0
        ),

        contacted: Number(
          data?.contacted ??
          data?.dihubungi ??
          0
        ),

        completed: Number(
          data?.completed ??
          data?.selesai ??
          0
        ),
      }
    } catch (error) {
      console.error(
        'GET /leads/stats error:',
        error?.response?.data || error
      )

      throw new Error(
        getErrorMessage(
          error,
          'Gagal mengambil statistik leads.'
        )
      )
    }
  },
}