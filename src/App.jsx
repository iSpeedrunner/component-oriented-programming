import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import CountryDetailsPage from './pages/CountryDetailsPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:code" element={<CountryDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
