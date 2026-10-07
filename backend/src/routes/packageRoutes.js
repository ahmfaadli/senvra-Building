const express = require('express')

const {
    getPackages,
    getPackageById,
    createPackage,
    updatePackage,
    deletePackage,
} = require('../controllers/packageController')

const router = express.Router()

router.get('/', getPackages)

router.get('/:id', getPackageById)

router.post('/', createPackage)

router.put('/:id', updatePackage)

router.delete('/:id', deletePackage)

module.exports = router