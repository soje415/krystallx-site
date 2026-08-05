import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { HudBar } from './components/HudBar'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Environmental } from './pages/Environmental'
import { Maritime } from './pages/Maritime'
import { LandThreat } from './pages/LandThreat'
import { Security } from './pages/Security'
import { Deployment } from './pages/Deployment'
import { Mission } from './pages/Mission'
import { Evidence } from './pages/Evidence'
import { RequestBriefing } from './pages/RequestBriefing'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/environmental-intelligence" element={<Environmental />} />
        <Route path="/maritime-domain-awareness" element={<Maritime />} />
        <Route path="/land-threat-intelligence" element={<LandThreat />} />
        <Route path="/security-identity" element={<Security />} />
        <Route path="/state-police-deployment" element={<Deployment />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/evidence" element={<Evidence />} />
        <Route path="/request-briefing" element={<RequestBriefing />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <HudBar />
        <Nav />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
