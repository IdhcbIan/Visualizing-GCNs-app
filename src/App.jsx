import { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Header from './Legos/Header'
const GlobalStyle = createGlobalStyle`
  // ... existing code ...
`

const Hero = styled.section`
  min-height: 60vh; /* Reduced from 90vh to 60vh */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem; /* Reduced from 4rem to 2rem */
  position: relative;
  border-bottom: 3px solid #4287f5;
  box-shadow: 0 4px 30px rgba(66, 135, 245, 0.15);
  background-color: #2a3b4c;
  
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid rgba(66, 135, 245, 0.3);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem; /* Reduced from 3rem to 1.5rem */
    min-height: 50vh; /* Reduced from 80vh to 50vh for mobile */
  }
`

const HeroContent = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  h1 {
    color: white;
    font-size: 2rem;
    margin: 0;
    font-family: 'Unna', serif;
  }

  p {
    color: white;
    font-size: 1.4rem;
    margin: 0;
    font-family: 'Unna', serif;
    display: flex;
    align-items: center;
    
    &:before {
      content: '•';
      margin-right: 0.8rem;
    }
  }
`

const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem; /* Reduced from 2rem to 1.5rem */
  padding: 2rem; /* Reduced from 4rem to 2rem */
  background-color: #f5f7fa;
  
  @media (max-width: 768px) {
    padding: 1rem; /* Reduced from 2rem to 1rem */
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled(motion.div)`
  background-color: white;
  padding: 1.5rem; /* Reduced from 2rem to 1.5rem */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  h3 {
    font-size: 1.5rem;
    margin-top: 0;
    color: #2a3b4c;
    font-family: 'Unna', serif;
  }
  
  p {
    color: #4a5568;
    line-height: 1.6;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem; /* Reduced from 1.5rem to 1rem */
  padding: 1.5rem 0; /* Reduced from 3rem to 1.5rem */
  background-color: #f5f7fa;
`

const Button = styled(motion.button)`
  padding: 0.6rem 1.2rem; /* Reduced from 0.8rem 1.8rem to 0.6rem 1.2rem */
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Unna', serif;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &.primary {
    background-color: #4287f5;
    color: white;
  }
  
  &.secondary {
    background-color: white;
    color: #2a3b4c;
    border: 2px solid #4287f5;
  }
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

function App() {
  const [features] = useState([
    {
      title: "Visualização Interativa",
      description: "Explore grafos com visualizações intuitivas e interativas que ajudam a entender estruturas de rede complexas.",
      icon: null
    },
    {
      title: "Análise Avançada",
      description: "Configure os parametros do grafo para melhor visualizacao e analise características de nós.",
      icon: null
    },
    {
      title: "Exportar e Compartilhar",
      description: "Exporte suas visualizações em vários formatos ou compartilhe com colegas para pesquisa colaborativa.",
      icon: null
    }
  ])

  return (
    <>
      <GlobalStyle />
      <AnimatePresence mode="wait">
        <motion.div key="app-content">
          <motion.main
            key="hero-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero>
              <HeroContent>
                <h1>GCN Visualizer</h1>
                <p>Visualize e compreenda Redes Convolucionais de Grafos</p>
              </HeroContent>
            </Hero>
          </motion.main>

          <FeatureGrid>
            {features.map((feature, index) => (
              <FeatureCard
                key={`feature-${index}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </FeatureCard>
            ))}
          </FeatureGrid>
          
          <ButtonContainer>
            <StyledLink to="/projects">
              <Button 
                className="primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try It Out
              </Button>
            </StyledLink>
            <Button 
              className="secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              See Demo
            </Button>
          </ButtonContainer>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App
