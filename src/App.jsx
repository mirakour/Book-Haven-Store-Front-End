import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Products from './pages/Products'
import BookDetails from './pages/BookDetails'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<BookDetails />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
