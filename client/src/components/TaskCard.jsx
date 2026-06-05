import { useState } from 'react'

function TaskCard({ task, onDelete, onToggle, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isCompleted = task.status === 'completed'

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div style={{
      ...styles.card,
      borderLeft: isCompleted ? '4px solid #10b981' : '4px solid #f59e0b'
    }}>

      {/* Top row — title + status badge */}
      <div style={styles.topRow}>
        <h4 style={{
          ...styles.title,
          textDecoration: isCompleted ? 'line-through' : 'none',
          color: isCompleted ? '#9ca3af' : '#1a1a2e'
        }}>
          {task.title}
        </h4>
        <span style={{
          ...styles.badge,
          backgroundColor: isCompleted ? '#d1fae5' : '#fef3c7',
          color: isCompleted ? '#065f46' : '#92400e'
        }}>
          {isCompleted ? '✅ Completed' : '⏳ Pending'}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      {/* Date */}
      <p style={styles.date}>Created: {formatDate(task.createdAt)}</p>

      {/* Action buttons */}
      <div style={styles.actions}>

        {/* Toggle button */}
        <button
          onClick={() => onToggle(task._id)}
          style={isCompleted ? styles.undoBtn : styles.completeBtn}
        >
          {isCompleted ? '↩ Mark Pending' : '✓ Mark Complete'}
        </button>

        {/* Edit button */}
        <button
          onClick={() => onEdit(task)}
          style={styles.editBtn}
        >
          ✏️ Edit
        </button>

        {/* Delete button */}
        {confirmDelete ? (
          <div style={styles.confirmRow}>
            <span style={styles.confirmText}>Sure?</span>
            <button
              onClick={() => onDelete(task._id)}
              style={styles.confirmYes}
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={styles.confirmNo}
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            style={styles.deleteBtn}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    marginBottom: '12px'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '12px'
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    flex: 1
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  date: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '14px'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  completeBtn: {
    padding: '7px 14px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  undoBtn: {
    padding: '7px 14px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  editBtn: {
    padding: '7px 14px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '7px 14px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  confirmText: {
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: '600'
  },
  confirmYes: {
    padding: '6px 12px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  confirmNo: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    color: '#444',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}

export default TaskCard