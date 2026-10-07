const { pool } = require('../config/database')

const getPackages = async (req, res) => {
    try {
        const [packages] = await pool.query(`
            SELECT id, name, price, price_note AS priceNote, area, description, 
                   popular, cta, cta_variant AS ctaVariant, status, 
                   created_at AS createdAt, updated_at AS updatedAt
            FROM packages
            ORDER BY created_at ASC
        `)

        const [features] = await pool.query(`
            SELECT id, package_id AS packageId, feature, sort_order AS sortOrder
            FROM package_features
            ORDER BY package_id, sort_order ASC, id ASC
        `)

        const result = packages.map((pkg) => ({
            ...pkg,
            popular: Boolean(pkg.popular),
            features: features
                .filter((item) => item.packageId === pkg.id)
                .map((item) => item.feature),
        }))

        return res.json({ success: true, data: result })
    } catch (error) {
        console.error('GET PACKAGES ERROR:', error)
        return res.status(500).json({ success: false, message: 'Gagal mengambil data paket', error: error.message })
    }
}

const getPackageById = async (req, res) => {
    const { id } = req.params

    try {
        const [packages] = await pool.query(`
            SELECT id, name, price, price_note AS priceNote, area, description, 
                   popular, cta, cta_variant AS ctaVariant, status, 
                   created_at AS createdAt, updated_at AS updatedAt
            FROM packages WHERE id = ? LIMIT 1
        `, [id])

        if (packages.length === 0) {
            return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' })
        }

        const [features] = await pool.query(`
            SELECT id, package_id AS packageId, feature, sort_order AS sortOrder
            FROM package_features WHERE package_id = ?
            ORDER BY sort_order ASC, id ASC
        `, [id])

        const pkg = {
            ...packages[0],
            popular: Boolean(packages[0].popular),
            features: features.map((item) => item.feature),
        }

        return res.json({ success: true, data: pkg })
    } catch (error) {
        console.error('GET PACKAGE ERROR:', error)
        return res.status(500).json({ success: false, message: 'Gagal mengambil detail paket', error: error.message })
    }
}

const createPackage = async (req, res) => {
    const {
        id, name, price, priceNote, area, description,
        features = [], popular = false, cta = 'Pilih Paket & Konsultasi',
        ctaVariant = 'outline', status = 'active',
    } = req.body

    if (!id || !name || !price) {
        return res.status(400).json({ success: false, message: 'ID, nama paket, dan harga wajib diisi' })
    }

    const connection = await pool.getConnection()

    try {
        await connection.beginTransaction()

        await connection.query(`
            INSERT INTO packages (id, name, price, price_note, area, description, popular, cta, cta_variant, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, name, price, priceNote || null, area || null, description || null, Boolean(popular), cta || null, ctaVariant || 'outline', status || 'active'])

        if (Array.isArray(features) && features.length > 0) {
            for (let i = 0; i < features.length; i++) {
                await connection.query(`
                    INSERT INTO package_features (package_id, feature, sort_order)
                    VALUES (?, ?, ?)
                `, [id, features[i], i + 1])
            }
        }

        await connection.commit()
        return res.status(201).json({ success: true, message: 'Paket berhasil dibuat' })
    } catch (error) {
        await connection.rollback()
        console.error('CREATE PACKAGE ERROR:', error)
        return res.status(500).json({ success: false, message: 'Gagal membuat paket', error: error.message })
    } finally {
        connection.release()
    }
}

const updatePackage = async (req, res) => {
    const { id } = req.params
    const {
        name, price, priceNote, area, description,
        features, popular, cta, ctaVariant, status,
    } = req.body

    const connection = await pool.getConnection()

    try {
        const [existing] = await connection.query('SELECT id FROM packages WHERE id = ? LIMIT 1', [id])
        if (existing.length === 0) {
            connection.release()
            return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' })
        }

        await connection.beginTransaction()

        await connection.query(`
            UPDATE packages 
            SET name = ?, price = ?, price_note = ?, area = ?, description = ?, 
                popular = ?, cta = ?, cta_variant = ?, status = ?
            WHERE id = ?
        `, [
            name, price, priceNote || null, area || null, description || null,
            Boolean(popular), cta || null, ctaVariant || 'outline', status || 'active', id,
        ])

        if (Array.isArray(features)) {
            await connection.query('DELETE FROM package_features WHERE package_id = ?', [id])

            for (let i = 0; i < features.length; i++) {
                const feature = String(features[i]).trim()
                if (!feature) continue

                await connection.query(`
                    INSERT INTO package_features (package_id, feature, sort_order)
                    VALUES (?, ?, ?)
                `, [id, feature, i + 1])
            }
        }

        await connection.commit()
        return res.json({ success: true, message: 'Paket berhasil diperbarui' })
    } catch (error) {
        await connection.rollback()
        console.error('UPDATE PACKAGE ERROR:', error)
        return res.status(500).json({ success: false, message: 'Gagal memperbarui paket', error: error.message })
    } finally {
        connection.release()
    }
}

const deletePackage = async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await pool.query('DELETE FROM packages WHERE id = ?', [id])

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Paket tidak ditemukan' })
        }

        return res.json({ success: true, message: 'Paket berhasil dihapus' })
    } catch (error) {
        console.error('DELETE PACKAGE ERROR:', error)
        return res.status(500).json({ success: false, message: 'Gagal menghapus paket', error: error.message })
    }
}

module.exports = {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
}