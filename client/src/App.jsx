import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import UserSignup from './pages/UserSignup'
import CourseManagement from './pages/CourseManagement'

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="nav-logo">Tee Timer</Link>
            <div className="nav-links">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
              <Link to="/user-signup" className={location.pathname === '/user-signup' ? 'active' : ''}>
                Book Tee Time
              </Link>
              <Link to="/course-management" className={location.pathname === '/course-management' ? 'active' : ''}>
                Course Management
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/course-management" element={<CourseManagement />} />
        </Routes>
      </main>

      <footer className="container" style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem 0', borderTop: '1px solid #eee' }}>
        <p>&copy; {new Date().getFullYear()} Tee Timer. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App