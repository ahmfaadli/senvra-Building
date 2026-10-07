const express = require('express')

const {
    getAllPortfolios,
    getPortfolioById,
    getPortfolioStats,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require('../controllers/portfolioController')

const router = express.Router()

router.get('/', getAllPortfolios)

router.get('/stats', getPortfolioStats)

router.get('/:id', getPortfolioById)

router.post('/', createPortfolio)

router.put('/:id', updatePortfolio)

router.delete('/:id', deletePortfolio)

module.exports = router