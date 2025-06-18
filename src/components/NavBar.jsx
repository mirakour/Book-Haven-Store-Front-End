import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'))
  }, [])

  function logout() {
    localStorage.removeItem('token')
    setLoggedIn(false)
    navigate('/login')
  }

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
      <Link to="/products">📚 Book Haven</Link>
      <Link to="/account">Account</Link>
      {loggedIn ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

export default NavBar