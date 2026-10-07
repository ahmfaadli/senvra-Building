const db = require('../config/database')

/*
|--------------------------------------------------------------------------
| Generate Lead ID
|--------------------------------------------------------------------------
*/

const generateLeadId = async () => {
    const [rows] = await db.pool.query(`
        SELECT id
        FROM leads
        WHERE id LIKE 'lead-%'
        ORDER BY CAST(SUBSTRING(id, 6) AS UNSIGNED) DESC
        LIMIT 1
    `)

    let nextNumber = 1

    if (rows.length > 0) {
        const lastId = String(rows[0].id)

        const lastNumber = parseInt(
            lastId.replace('lead-', ''),
            10
        )

        if (!Number.isNaN(lastNumber)) {
            nextNumber = lastNumber + 1
        }
    }

    return `lead-${String(nextNumber).padStart(3, '0')}`
}

/*
|--------------------------------------------------------------------------
| GET /api/leads
|--------------------------------------------------------------------------
*/

exports.getAllLeads = async (req, res) => {
    try {
        const [rows] = await db.pool.query(`
            SELECT
                id,
                name,
                whatsapp,
                email,
                area,
                building_type AS buildingType,
                package_id AS packageId,
                message,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM leads
            ORDER BY created_at DESC
        `)

        res.status(200).json({
            success: true,
            data: rows,
        })
    } catch (error) {
        console.error('❌ Get leads error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data leads',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        })
    }
}

/*
|--------------------------------------------------------------------------
| GET /api/leads/:id
|--------------------------------------------------------------------------
*/

exports.getLeadById = async (req, res) => {
    try {
        const { id } = req.params

        const [rows] = await db.pool.query(
            `
            SELECT
                id,
                name,
                whatsapp,
                email,
                area,
                building_type AS buildingType,
                package_id AS packageId,
                message,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM leads
            WHERE id = ?
            `,
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lead tidak ditemukan',
            })
        }

        res.status(200).json({
            success: true,
            data: rows[0],
        })
    } catch (error) {
        console.error('❌ Get lead error:', error)

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail lead',
            error:
                process.env.NODE_ENV === 'development'
                    ? error.message
                    : undefined,
        })
    }
}

/*
|--------------------------------------------------------------------------
| POST /api/leads
|--------------------------------------------------------------------------
*/

exports.createLead = async (req, res) => {
    try {
        console.log('')
        console.log('========================================')
        console.log('📩 CREATE LEAD')
        console.log('========================================')
        console.log('Request body:')
        console.log(req.body)

        const {
            name,
            whatsapp,
            email,
            area,
            buildingType,
            packageId,
            message,
        } = req.body

        /*
        |--------------------------------------------------------------------------
        | Validasi
        |--------------------------------------------------------------------------
        */

        if (!name || !String(name).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama wajib diisi',
            })
        }

        if (!whatsapp || !String(whatsapp).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nomor WhatsApp wajib diisi',
            })
        }

        if (!buildingType || !String(buildingType).trim()) {
            return res.status(400).json({
                success: false,
                message: 'Jenis bangunan wajib dipilih',
            })
        }

        /*
        |--------------------------------------------------------------------------
        | Generate ID
        |--------------------------------------------------------------------------
        */

        const id = await generateLeadId()

        console.log('Generated ID:', id)

        /*
        |--------------------------------------------------------------------------
        | Normalisasi area
        |--------------------------------------------------------------------------
        */

        let normalizedArea = null

        if (
            area !== undefined &&
            area !== null &&
            String(area).trim() !== ''
        ) {
            const parsedArea = Number(
                String(area).replace(',', '.')
            )

            if (Number.isNaN(parsedArea)) {
                return res.status(400).json({
                    success: false,
                    message: 'Luas bangunan harus berupa angka',
                })
            }

            normalizedArea = parsedArea
        }

        /*
        |--------------------------------------------------------------------------
        | Insert
        |--------------------------------------------------------------------------
        */

        const sql = `
            INSERT INTO leads
            (
                id,
                name,
                whatsapp,
                email,
                area,
                building_type,
                package_id,
                message,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `

        const values = [
            id,
            String(name).trim(),
            String(whatsapp).trim(),
            email ? String(email).trim() : null,
            normalizedArea,
            String(buildingType).trim(),
            packageId ? String(packageId).trim() : null,
            message ? String(message).trim() : null,
            'Baru',
        ]

        console.log('Insert values:')
        console.log(values)

        const [result] = await db.pool.query(
            sql,
            values
        )

        console.log('Insert result:', result)

        /*
        |--------------------------------------------------------------------------
        | Ambil data setelah insert
        |--------------------------------------------------------------------------
        */

        const [rows] = await db.pool.query(
            `
            SELECT
                id,
                name,
                whatsapp,
                email,
                area,
                building_type AS buildingType,
                package_id AS packageId,
                message,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM leads
            WHERE id = ?
            `,
            [id]
        )

        console.log('Created lead:')
        console.log(rows[0])

        console.log('========================================')
        console.log('✅ LEAD BERHASIL DIBUAT')
        console.log('========================================')
        console.log('')

        return res.status(201).json({
            success: true,
            message: 'Lead berhasil dibuat',
            data: rows[0],
        })
    } catch (error) {
        console.error('')
        console.error('========================================')
        console.error('❌ CREATE LEAD ERROR')
        console.error('========================================')
        console.error('Message:', error.message)
        console.error('Code:', error.code)
        console.error('SQL State:', error.sqlState)
        console.error('SQL Message:', error.sqlMessage)
        console.error('========================================')
        console.error('')

        return res.status(500).json({
            success: false,
            message: 'Gagal membuat lead',
            error: error.message,
            code: error.code,
        })
    }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/leads/:id/status
|--------------------------------------------------------------------------
*/

exports.updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const allowedStatus = [
            'Baru',
            'Dihubungi',
            'Selesai',
        ]

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status tidak valid',
            })
        }

        const [result] = await db.pool.query(
            `
            UPDATE leads
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lead tidak ditemukan',
            })
        }

        const [rows] = await db.pool.query(
            `
            SELECT
                id,
                name,
                whatsapp,
                email,
                area,
                building_type AS buildingType,
                package_id AS packageId,
                message,
                status,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM leads
            WHERE id = ?
            `,
            [id]
        )

        return res.status(200).json({
            success: true,
            message: 'Status berhasil diperbarui',
            data: rows[0],
        })
    } catch (error) {
        console.error(
            '❌ Update lead status error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Gagal mengubah status lead',
            error: error.message,
        })
    }
}

/*
|--------------------------------------------------------------------------
| DELETE /api/leads/:id
|--------------------------------------------------------------------------
*/

exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params

        const [result] = await db.pool.query(
            'DELETE FROM leads WHERE id = ?',
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Lead tidak ditemukan',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Lead berhasil dihapus',
        })
    } catch (error) {
        console.error(
            '❌ Delete lead error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus lead',
            error: error.message,
        })
    }
}

/*
|--------------------------------------------------------------------------
| GET /api/leads/stats
|--------------------------------------------------------------------------
*/

exports.getLeadStats = async (req, res) => {
    try {
        const [rows] = await db.pool.query(`
            SELECT
                COUNT(*) AS total,
                SUM(status = 'Baru') AS newLeads,
                SUM(status = 'Dihubungi') AS contacted,
                SUM(status = 'Selesai') AS completed
            FROM leads
        `)

        const stats = rows[0]

        return res.status(200).json({
            success: true,
            data: {
                total: Number(stats.total || 0),
                newLeads: Number(stats.newLeads || 0),
                contacted: Number(stats.contacted || 0),
                completed: Number(stats.completed || 0),
            },
        })
    } catch (error) {
        console.error(
            '❌ Lead stats error:',
            error
        )

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil statistik leads',
            error: error.message,
        })
    }
}