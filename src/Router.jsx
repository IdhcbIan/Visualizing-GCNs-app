import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import Projects from './Pages/Projects.jsx'
import Renderer from './Pages/Visual/Renderer.jsx'
import Demo from './Pages/Demo.jsx'
import Login from './Pages/Login.jsx'
import Profile from './Auth/Profile.jsx'

// Import Amplify
import { Amplify } from 'aws-amplify'
import amplifyconfig from '../amplify/amplifyconfiguration.json'
// Import Authenticator Provider
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// Configure Amplify with explicit auth configuration
Amplify.configure({
  ...amplifyconfig,
  Auth: {
    region: amplifyconfig.aws_cognito_region,
    userPoolId: amplifyconfig.aws_user_pools_id,
    userPoolWebClientId: amplifyconfig.aws_user_pools_web_client_id
  }
});

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
    <Authenticator.Provider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/visual" element={<Renderer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Authenticator.Provider>
  </StrictMode>,
)
