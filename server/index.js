const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log('MongoDB connected!')
    })
  })
  .catch((err) => {
    console.log('Connection error:', err.message)
  })