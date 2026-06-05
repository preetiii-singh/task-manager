const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check all fields exist
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    // Check JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' })
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.log('Register error:', error.message)
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Check JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' })
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    console.log('Login error:', error.message)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router