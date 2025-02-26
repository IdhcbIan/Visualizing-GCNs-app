import { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../Legos/Header'
import ProjectCard from '../Legos/ProjectCard'

const GlobalStyle = createGlobalStyle`
  // ... existing code ...
`

const Hero = styled.section`
  min-height: 40vh; /* Reduced from 60vh to 40vh */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem; /* Reduced from 1.5rem to 1rem */
  position: relative;
  background-color: #f5f7fa;
  
  @media (max-width: 768px) {
    padding: 0.75rem; /* Reduced from 1rem to 0.75rem */
    min-height: 35vh; /* Reduced from 50vh to 35vh for mobile */
  }
`

const PageTitle = styled.h1`
  color: #2a3b4c;
  font-size: 3rem;
  text-align: center;
  font-family: 'Unna', serif;
  margin-bottom: 0.75rem; /* Reduced from 1.5rem to 0.75rem */
`

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;
  margin-bottom: 0.5rem; /* Added margin-bottom to reduce space */
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem; /* Reduced from 1.5rem to 1rem */
  }
`

const ProjectsHeading = styled.h2`
  color: #2a3b4c;
  font-size: 2rem;
  font-family: 'Unna', serif;
  margin: 0;
`

const UploadButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Unna', serif;
  background-color: #4287f5;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

const ProjectsContainer = styled.section`
  padding: 2rem 1.5rem; /* Reduced from 3rem 2rem to 2rem 1.5rem */
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem; /* Reduced from 2rem 1rem to 1.5rem 1rem */
  }
`

function App() {
  const projects = [
    {
      title: "Espécies de Flores",
      description: "Classificação de Espécies de Flores",
      imageUrl: "/images/flower-species.jpg",
      linkTo: "/projects/flower-species",
      linkText: "Explorar Projeto"
    },
    {
      title: "Espécies de Plantas",
      description: "Classificação de Espécies de Plantas",
      imageUrl: "/images/plant-species.jpg",
      linkTo: "/projects/plant-species",
      linkText: "Ver Detalhes"
    },
    {
      title: "Modelos de Aviões",
      description: "Classificação de Modelos de Aviões",
      imageUrl: "/images/airplane-model.jpg",
      linkTo: "/projects/airplane-model",
      linkText: "Ver Demonstração"
    }
  ]

  return (
    <>
      <GlobalStyle />
      <AnimatePresence mode="wait">
        <motion.div key="app-content">
          <Header />
          <motion.main
            key="hero-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero>
              <PageTitle>Nossos Últimos Runs</PageTitle>
              <ContentContainer>
                <ProjectsHeading>DataSets</ProjectsHeading>
                <UploadButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Carregar Imagens
                </UploadButton>
              </ContentContainer>
            </Hero>
          </motion.main>

          <ProjectsContainer>
            {projects.map((project, index) => (
              <ProjectCard
                key={`project-${index}`}
                title={project.title}
                description={project.description}
                imageUrl={project.imageUrl}
                linkTo={project.linkTo}
                linkText={project.linkText}
              />
            ))}
          </ProjectsContainer>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App
