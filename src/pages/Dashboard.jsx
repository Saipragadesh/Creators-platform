import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      navigate('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      // Clear invalid data and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }

    setIsLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <section style={{ padding: '3rem 0' }}>
        <div className="container section-card">
          <div style={{ textAlign: 'center' }}>
            <p>Loading...</p>
          </div>
        </div>
      </section>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <section style={{ padding: '3rem 0' }}>
      <div className="container section-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="page-heading">Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            Logout
          </button>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          padding: '2rem',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Welcome back, {user.name}!</h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Profile Settings</h4>
              <p style={{ margin: '0', color: '#64748b', fontSize: '0.875rem' }}>
                Update your account information
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>My Content</h4>
              <p style={{ margin: '0', color: '#64748b', fontSize: '0.875rem' }}>
                Manage your created content
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Analytics</h4>
              <p style={{ margin: '0', color: '#64748b', fontSize: '0.875rem' }}>
                View your performance metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
