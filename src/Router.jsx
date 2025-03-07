import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import Projects from './Pages/Projects.jsx'
import Renderer from './Pages/Visual/Renderer.jsx'
import Demo from './Pages/Demo.jsx'

// Import Amplify
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplifyconfiguration.json'

// Configure Amplify
Amplify.configure(amplifyconfig)

// ScrollToTop component to handle scrolling to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/visual" element={<Renderer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
