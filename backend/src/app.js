const express = require('express')
const cors = require('cors')

const portfolioRoutes = require('./routes/portfolioRoutes')
const packageRoutes = require('./routes/packageRoutes')
const leadRoutes = require('./routes/leadRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Root API
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Senvra Studio API berjalan',
    })
})

// Routes
app.use('/api/portfolios', portfolioRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/leads', leadRoutes)

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan',
    })
})

// Error Handler
app.use((err, req, res, next) => {
    console.error('APP ERROR:', err)

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    })
})

module.exports = app