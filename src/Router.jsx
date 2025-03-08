import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import Projects from './Pages/Projects.jsx'
import Renderer from './Pages/Visual/Renderer.jsx'
import Demo from './Pages/Demo.jsx'

// Import Amplify
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplify/amplifyconfiguration.json'
// Import Authenticator Provider
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

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
    {/* Wrap the entire app with Authenticator.Provider */}
    <Authenticator.Provider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/visual" element={<Renderer />} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  </StrictMode>,
)
