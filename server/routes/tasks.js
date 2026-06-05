const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const auth = require('../middleware/auth')

// GET all tasks for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id })
      .sort({ createdAt: -1 })

    res.status(200).json(tasks)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// CREATE a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = new Task({
      title,
      description,
      userId: req.user.id
    })

    await task.save()
    res.status(201).json(task)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// UPDATE a task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Make sure user owns this task
    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )

    res.status(200).json(updatedTask)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// TOGGLE task status (pending ↔ completed)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending'
    await task.save()

    res.status(200).json(task)

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// DELETE a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await task.deleteOne()
    res.status(200).json({ message: 'Task deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router