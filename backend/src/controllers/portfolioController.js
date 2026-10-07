const { pool } = require('../config/database')

const normalizePortfolio = (row) => {
    if (!row) {
        return null
    }

    return {
        id: row.id,
        title: row.title || '',
        category: row.category || '',
        location: row.location || '',
        building_area: row.building_area || '',
        description: row.description || '',
        thumbnail: row.thumbnail || '',
        design_concept: row.design_concept || '',
        building_type: row.building_type || 'Hunian',
        status: row.status || 'draft',
        featured: Boolean(row.featured),
        created_at: row.created_at,
        updated_at: row.updated_at
    }
}

const getAllPortfolios = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id,
                title,
                category,
                location,
                building_area,
                description,
                thumbnail,
                design_concept,
                building_type,
                status,
                featured,
                created_at,
                updated_at
            FROM portfolios
            ORDER BY id DESC
        `)

        return res.status(200).json({
            success: true,
            data: rows.map(normalizePortfolio)
        })
    } catch (error) {
        console.error('GET PORTFOLIOS ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

const getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio ID wajib diisi'
            })
        }

        const [rows] = await pool.query(
            `
            SELECT
                id,
                title,
                category,
                location,
                building_area,
                description,
                thumbnail,
                design_concept,
                building_type,
                status,
                featured,
                created_at,
                updated_at
            FROM portfolios
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio tidak ditemukan'
            })
        }

        return res.status(200).json({
            success: true,
            data: normalizePortfolio(rows[0])
        })
    } catch (error) {
        console.error('GET PORTFOLIO ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

const getPortfolioStats = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN status = 'published'
                        THEN 1
                        ELSE 0
                    END
                ) AS published,

                SUM(
                    CASE
                        WHEN status = 'draft'
                        THEN 1
                        ELSE 0
                    END
                ) AS draft,

                SUM(
                    CASE
                        WHEN featured = 1
                        THEN 1
                        ELSE 0
                    END
                ) AS featured

            FROM portfolios
        `)

        const stats = rows[0]

        return res.status(200).json({
            success: true,
            data: {
                total: Number(stats.total || 0),
                published: Number(stats.published || 0),
                draft: Number(stats.draft || 0),
                featured: Number(stats.featured || 0)
            }
        })
    } catch (error) {
        console.error('GET PORTFOLIO STATS ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

const createPortfolio = async (req, res) => {
    try {
        const {
            title,
            category,
            location,
            building_area,
            description,
            thumbnail,
            design_concept,
            building_type,
            status,
            featured
        } = req.body

        if (!title || !String(title).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama proyek wajib diisi'
            })
        }

        if (!category || !String(category).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Kategori wajib diisi'
            })
        }

        const [result] = await pool.query(
            `
            INSERT INTO portfolios (
                title,
                category,
                location,
                building_area,
                description,
                thumbnail,
                design_concept,
                building_type,
                status,
                featured
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                String(title).trim(),
                String(category).trim(),
                location || null,
                building_area || null,
                description || null,
                thumbnail || null,
                design_concept || null,
                building_type || 'Hunian',
                status || 'draft',
                featured ? 1 : 0
            ]
        )

        const [rows] = await pool.query(
            `
            SELECT
                id,
                title,
                category,
                location,
                building_area,
                description,
                thumbnail,
                design_concept,
                building_type,
                status,
                featured,
                created_at,
                updated_at
            FROM portfolios
            WHERE id = ?
            LIMIT 1
            `,
            [result.insertId]
        )

        return res.status(201).json({
            success: true,
            message: 'Portfolio berhasil ditambahkan',
            data: normalizePortfolio(rows[0])
        })
    } catch (error) {
        console.error('CREATE PORTFOLIO ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params

        const {
            title,
            category,
            location,
            building_area,
            description,
            thumbnail,
            design_concept,
            building_type,
            status,
            featured
        } = req.body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio ID wajib diisi'
            })
        }

        if (!title || !String(title).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama proyek wajib diisi'
            })
        }

        if (!category || !String(category).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Kategori wajib diisi'
            })
        }

        const [existing] = await pool.query(
            `
            SELECT id
            FROM portfolios
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio tidak ditemukan'
            })
        }

        await pool.query(
            `
            UPDATE portfolios
            SET
                title = ?,
                category = ?,
                location = ?,
                building_area = ?,
                description = ?,
                thumbnail = ?,
                design_concept = ?,
                building_type = ?,
                status = ?,
                featured = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,
            [
                String(title).trim(),
                String(category).trim(),
                location || null,
                building_area || null,
                description || null,
                thumbnail || null,
                design_concept || null,
                building_type || 'Hunian',
                status || 'draft',
                featured ? 1 : 0,
                id
            ]
        )

        const [rows] = await pool.query(
            `
            SELECT
                id,
                title,
                category,
                location,
                building_area,
                description,
                thumbnail,
                design_concept,
                building_type,
                status,
                featured,
                created_at,
                updated_at
            FROM portfolios
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        return res.status(200).json({
            success: true,
            message: 'Portfolio berhasil diperbarui',
            data: normalizePortfolio(rows[0])
        })
    } catch (error) {
        console.error('UPDATE PORTFOLIO ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Portfolio ID wajib diisi'
            })
        }

        const [existing] = await pool.query(
            `
            SELECT id
            FROM portfolios
            WHERE id = ?
            LIMIT 1
            `,
            [id]
        )

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Portfolio tidak ditemukan'
            })
        }

        await pool.query(
            `
            DELETE FROM portfolios
            WHERE id = ?
            `,
            [id]
        )

        return res.status(200).json({
            success: true,
            message: 'Portfolio berhasil dihapus'
        })
    } catch (error) {
        console.error('DELETE PORTFOLIO ERROR:', error)

        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus portfolio',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined
        })
    }
}

module.exports = {
    getAllPortfolios,
    getPortfolioById,
    getPortfolioStats,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
}