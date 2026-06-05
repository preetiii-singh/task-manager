import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import TaskCard from '../components/TaskCard'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Add task form
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [formError, setFormError] = useState('')

  // Edit task
  const [editTask, setEditTask] = useState(null)

  // Fetch all tasks
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!newTask.title) {
      return setFormError('Title is required')
    }

    try {
      const res = await API.post('/tasks', newTask)
      setTasks([res.data, ...tasks])
      setNewTask({ title: '', description: '' })
      setShowForm(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add task')
    }
  }

  // Delete task
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`)
      setTasks(tasks.filter(task => task._id !== id))
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  // Toggle task status
  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/tasks/${id}/toggle`)
      setTasks(tasks.map(task =>
        task._id === id ? res.data : task
      ))
    } catch (err) {
      alert('Failed to update task')
    }
  }

  // Update task
  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editTask.title) {
      return alert('Title is required')
    }

    try {
      const res = await API.put(`/tasks/${editTask._id}`, {
        title: editTask.title,
        description: editTask.description
      })
      setTasks(tasks.map(task =>
        task._id === editTask._id ? res.data : task
      ))
      setEditTask(null)
    } catch (err) {
      alert('Failed to update task')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo}>📋 Task Manager</h1>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name} 👋</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.main}>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{tasks.length}</h3>
            <p style={styles.statLabel}>Total Tasks</p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #f59e0b'}}>
            <h3 style={styles.statNumber}>{pendingTasks.length}</h3>
            <p style={styles.statLabel}>Pending</p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #10b981'}}>
            <h3 style={styles.statNumber}>{completedTasks.length}</h3>
            <p style={styles.statLabel}>Completed</p>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? '✕ Cancel' : '+ Add New Task'}
        </button>

        {/* Add Task Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Task</h3>
            {formError && <div style={styles.error}>{formError}</div>}
            <form onSubmit={handleAddTask}>
              <input
                style={styles.input}
                type="text"
                placeholder="Task title *"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                style={styles.textarea}
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
              <button type="submit" style={styles.submitBtn}>
                Add Task
              </button>
            </form>
          </div>
        )}

        {/* Edit Task Form */}
        {editTask && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Edit Task</h3>
            <form onSubmit={handleUpdate}>
              <input
                style={styles.input}
                type="text"
                value={editTask.title}
                onChange={e => setEditTask({ ...editTask, title: e.target.value })}
              />
              <textarea
                style={styles.textarea}
                value={editTask.description}
                onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                rows={3}
              />
              <div style={styles.editButtons}>
                <button type="submit" style={styles.submitBtn}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditTask(null)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <p style={styles.message}>Loading tasks...</p>
        ) : error ? (
          <p style={styles.errorMsg}>{error}</p>
        ) : tasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No tasks yet!</p>
            <p style={styles.emptySubtext}>Click "Add New Task" to get started</p>
          </div>
        ) : (
          <div>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 style={styles.sectionTitle}>⏳ Pending ({pendingTasks.length})</h3>
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onEdit={setEditTask}
                  />
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 style={styles.sectionTitle}>✅ Completed ({completedTasks.length})</h3>
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onEdit={setEditTask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
  navbar: {
    backgroundColor: '#fff',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  logo: { fontSize: '20px', fontWeight: '700', color: '#1a1a2e' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { fontSize: '14px', color: '#666' },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px'
  },
  main: { maxWidth: '720px', margin: '0 auto', padding: '32px 16px' },
  stats: { display: 'flex', gap: '16px', marginBottom: '24px' },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderTop: '4px solid #4f46e5',
    textAlign: 'center'
  },
  statNumber: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e' },
  statLabel: { fontSize: '13px', color: '#666', marginTop: '4px' },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '20px'
  },
  formCard: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '24px'
  },
  formTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1a1a2e' },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#d00000',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical'
  },
  submitBtn: {
    padding: '10px 24px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  cancelBtn: {
    padding: '10px 24px',
    backgroundColor: '#f3f4f6',
    color: '#444',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  editButtons: { display: 'flex', gap: '12px' },
  message: { textAlign: 'center', color: '#666', padding: '40px' },
  errorMsg: { textAlign: 'center', color: '#dc2626', padding: '40px' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyText: { fontSize: '18px', fontWeight: '600', color: '#444' },
  emptySubtext: { fontSize: '14px', color: '#888', marginTop: '8px' },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '12px',
    marginTop: '24px'
  }
}

export default Dashboard