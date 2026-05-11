import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()

  if (loading) {
    return (
      <section style={{ padding: '3rem 0' }}>
        <div className="container section-card" style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute