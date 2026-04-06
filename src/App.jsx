import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import PredictionInputPage from './pages/PredictionInputPage'
import PredictionResultPage from './pages/PredictionResultPage'
import AboutPage from './pages/AboutPage'
import PerformancePage from './pages/PerformancePage'
import TeamPage from './pages/TeamPage'

export default function App() {
  return (
    <main className="w-full px-4 py-4 md:px-8 md:py-8">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/input" element={<PredictionInputPage />} />
        <Route path="/result" element={<PredictionResultPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/understanding" element={<Navigate to="/about" replace />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
