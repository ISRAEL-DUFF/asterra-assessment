import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Forms from './pages/Forms'
import IndexPage from './pages/Index'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>User Hobbies App</h1>
        <nav>
          <Link to="/">Index</Link>
          <Link to="/forms">Forms</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/forms" element={<Forms />} />
        </Routes>
      </main>

      <footer>
        <small>Asterra Assessment</small>
      </footer>
    </div>
  )
}
