const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ========================================
// HELPER
// ========================================

const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    })

    let result

    try {
        result = await response.json()
    } catch {
        result = null
    }

    if (!response.ok) {
        throw new Error(
            result?.message ||
                `Request gagal dengan status ${response.status}`
        )
    }

    return result
}

// ========================================
// PACKAGES SERVICE
// ========================================

export const packagesService = {
    // ------------------------------------
    // GET ALL
    // ------------------------------------

    async getAll() {
        const result = await request(`${API_URL}/packages`)

        return result?.data || []
    },

    // ------------------------------------
    // GET BY ID
    // ------------------------------------

    async getById(id) {
        const result = await request(
            `${API_URL}/packages/${id}`
        )

        return result?.data || null
    },

    // ------------------------------------
    // GET STATS
    // ------------------------------------

    async getStats() {
        const result = await request(
            `${API_URL}/packages/stats`
        )

        return (
            result?.data || {
                total: 0,
                active: 0,
                inactive: 0,
                popular: 0
            }
        )
    },

    // ------------------------------------
    // CREATE
    // ------------------------------------

    async create(data) {
        const result = await request(
            `${API_URL}/packages`,
            {
                method: 'POST',
                body: JSON.stringify(data)
            }
        )

        return result?.data || null
    },

    // ------------------------------------
    // UPDATE
    // ------------------------------------

    async update(id, data) {
        const result = await request(
            `${API_URL}/packages/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data)
            }
        )

        return result?.data || null
    },

    // ------------------------------------
    // DELETE
    // ------------------------------------

    async delete(id) {
        const result = await request(
            `${API_URL}/packages/${id}`,
            {
                method: 'DELETE'
            }
        )

        return result
    }
}