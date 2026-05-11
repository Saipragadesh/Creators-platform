import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function CreatePost() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setApiError('')
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 5) {
      nextErrors.title = 'Title must be at least 5 characters'
    }

    if (!formData.content.trim()) {
      nextErrors.content = 'Content is required'
    } else if (formData.content.trim().length < 20) {
      nextErrors.content = 'Content must be at least 20 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setApiError(data.message || 'Failed to create post. Please try again.')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Create post error:', error)
      setApiError('Unable to connect to the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container section-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 className="page-heading">Create New Post</h1>
        <p style={{ marginBottom: '1.25rem', color: '#475569' }}>
          Add a new post to your dashboard and share it with your creator community.
        </p>

        {apiError && (
          <div style={{ marginBottom: '1rem', color: '#dc2626' }}>{apiError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a title for your post"
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '0.75rem',
                border: errors.title ? '1px solid #dc2626' : '1px solid #d1d5db',
                marginBottom: '0.5rem',
                fontSize: '1rem'
              }}
              disabled={isLoading}
            />
            {errors.title && <p style={{ color: '#dc2626', marginTop: '0.25rem' }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="content" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here"
              rows={10}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: errors.content ? '1px solid #dc2626' : '1px solid #d1d5db',
                minHeight: '220px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              disabled={isLoading}
            />
            {errors.content && <p style={{ color: '#dc2626', marginTop: '0.25rem' }}>{errors.content}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '0.95rem 1.25rem',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default CreatePost
