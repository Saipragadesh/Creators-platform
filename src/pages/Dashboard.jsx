import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, loading, logout, token, isAuthenticated } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      return
    }

    if (token && !loading) {
      fetchPosts(page)
    }
  }, [loading, isAuthenticated, page, token])

  const fetchPosts = async (selectedPage = 1) => {
    setIsLoadingPosts(true)
    setError('')

    try {
      const response = await fetch(`/api/posts?page=${selectedPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Unable to load posts')
        setPosts([])
        setTotalPages(1)
        setTotalCount(0)
      } else {
        setPosts(data.data || [])
        setTotalCount(data.pagination.total)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (fetchError) {
      console.error('Fetch posts error:', fetchError)
      setError('Network error while loading posts')
    } finally {
      setIsLoadingPosts(false)
    }
  }

  if (loading) {
    return (
      <section style={{ padding: '3rem 0' }}>
        <div className="container section-card" style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-heading">Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0', color: '#475569' }}>
              Welcome back, {user.name}! Here are your latest posts.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              to="/create-post"
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Create New Post
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ color: '#334155' }}>
            <strong>{totalCount}</strong> post{totalCount === 1 ? '' : 's'} created
          </div>
          <div style={{ color: '#64748b' }}>
            Page {page} of {totalPages}
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', color: '#dc2626' }}>{error}</div>
        )}

        {isLoadingPosts ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, color: '#475569' }}>
              You haven't created any posts yet. Click "Create New Post" to add your first one.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {posts.map((post) => (
              <article key={post._id} style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '0.75rem', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#0f172a' }}>{post.title}</h2>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, color: '#475569', lineHeight: 1.8 }}>
                  {post.content.length > 220 ? `${post.content.slice(0, 220)}...` : post.content}
                </p>
              </article>
            ))}
          </div>
        )}

        {posts.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: page <= 1 ? '#e2e8f0' : '#3b82f6',
                color: page <= 1 ? '#64748b' : '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <div style={{ color: '#475569' }}>
              Showing page {page} of {totalPages}
            </div>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: page >= totalPages ? '#e2e8f0' : '#3b82f6',
                color: page >= totalPages ? '#64748b' : '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Dashboard
