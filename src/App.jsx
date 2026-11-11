import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import ThemeToggle from './components/ui/ThemeToggle/ThemeToggle.jsx'
import CountryDetailsPage from './pages/CountryDetailsPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <Link className="app-brand" to="/">World Economy Dashboard</Link>
          <ThemeToggle />
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/country/:code" element={<CountryDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
