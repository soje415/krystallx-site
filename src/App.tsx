import { useEffect } from 'react'
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
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-amber focus:text-void focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>
      <div className="min-h-screen flex flex-col">
        <HudBar />
        <Nav />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
