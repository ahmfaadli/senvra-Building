require('dotenv').config()

const app = require('./src/app')
const { testDatabaseConnection } = require('./src/config/database')

const PORT = Number(process.env.PORT) || 5000

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
    try {
        // Test koneksi database
        await testDatabaseConnection()

        // Jalankan server
        const server = app.listen(PORT, () => {
            console.log('')
            console.log('========================================')
            console.log('🚀 SENVRA STUDIO BACKEND')
            console.log('========================================')
            console.log(`🌐 Server    : http://localhost:${PORT}`)
            console.log(`📦 API       : http://localhost:${PORT}/api`)
            console.log(
                `🗄️ Database  : ${process.env.DB_NAME || 'senvra_studio'}`
            )
            console.log('========================================')
            console.log('')
        })

        // Handle error server
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error('')
                console.error(`❌ Port ${PORT} sudah digunakan.`)
                console.error(
                    `💡 Matikan server lain atau gunakan PORT berbeda.`
                )
                console.error('')
            } else {
                console.error('❌ Server error:', error.message)
            }

            process.exit(1)
        })
    } catch (error) {
        console.error('')
        console.error('========================================')
        console.error('❌ DATABASE / SERVER ERROR')
        console.error('========================================')
        console.error(error.message)
        console.error('========================================')
        console.error('')

        process.exit(1)
    }
}

// ========================================
// RUN
// ========================================

startServer()