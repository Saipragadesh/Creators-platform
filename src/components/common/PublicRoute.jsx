import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <section style={{ padding: '3rem 0' }}>
        <div className="container section-card" style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute