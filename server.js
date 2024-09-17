const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const cors = require('cors')

dotenv.config()

connectDB()

const app = express()

app.use(cors())

app.use(express.json())

const fileRoutes = require('./routes/fileRoutes')
const authRoutes = require('./routes/authRoutes')

app.use('/api/files', fileRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('WegenShare is Running')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})