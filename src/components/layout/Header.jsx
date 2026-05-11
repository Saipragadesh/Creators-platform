import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth()

  return (
    <header className="container" style={{ padding: '1rem 0' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Creator Hub
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          {!loading && isAuthenticated ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button
                type="button"
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: '1px solid #3b82f6',
                  color: '#3b82f6',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
              <span style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                {user?.name}
              </span>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
