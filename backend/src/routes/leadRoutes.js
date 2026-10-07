const express = require('express')

const router = express.Router()

const {
    getAllLeads,
    getLeadById,
    createLead,
    updateLeadStatus,
    deleteLead,
    getLeadStats,
} = require('../controllers/leadController')

router.get('/', getAllLeads)

router.get('/stats', getLeadStats)

router.get('/:id', getLeadById)

router.post('/', createLead)

router.patch('/:id/status', updateLeadStatus)

router.delete('/:id', deleteLead)

module.exports = router