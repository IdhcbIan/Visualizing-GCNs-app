import { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../Legos/Header'
import ProjectCard from '../Legos/ProjectCard'
import { Amplify } from 'aws-amplify'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getUrl } from 'aws-amplify/storage'
import awsExports from '../aws-exports.cjs'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

// Make sure we have a valid configuration object
const awsConfig = awsExports.default || awsExports;

// Configure Amplify with your AWS exports
Amplify.configure(awsConfig);

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

// Add a new styled component for the image preview container
const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`

const isProduction = window.location.hostname.includes('amplifyapp.com');
const baseApiUrl = isProduction 
  ? 'https://nvlqzt2dsb.execute-api.sa-east-1.amazonaws.com/main/api' 
  : 'http://15.228.252.194:5000/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  const fetchFlowerPreviews = async () => {
    try {
      const response = await fetch(`${baseApiUrl}/files/flowers-preview`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setPreviewImages(data.images);
        console.log('Preview image URLs:', data.images);
      } else {
        console.log('No preview images found');
        setPreviewImages([]);
      }
    } catch (error) {
      console.error('Error fetching flower previews:', error);
      setPreviewImages([]);
    }
  };

  const fetchProjectsInfo = async () => {
    try {
      const apiUrl = `${baseApiUrl}/files/info?requesttype=1`;
      console.log('Fetching from API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      const text = await response.text();
      console.log('Raw API Response:', text);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${text}`);
      }
      
      const jsonData = JSON.parse(text);
      console.log('Parsed JSON data:', jsonData);
      
      if (jsonData.status === 'success') {
        let projectsData;
        if (Array.isArray(jsonData.data)) {
          projectsData = jsonData.data;
        } else if (jsonData.data && Array.isArray(jsonData.data.projects)) {
          projectsData = jsonData.data.projects;
        } else if (jsonData.data && typeof jsonData.data === 'object') {
          projectsData = [jsonData.data];
        } else {
          projectsData = [];
        }
        
        console.log('Final projects data:', projectsData);
        setProjects(projectsData);
        setError(null);
        setErrorDetails('');
      } else {
        throw new Error(`API returned error status: ${jsonData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error in fetchProjectsInfo:', err);
      setError('Failed to load projects');
      setErrorDetails(`Error details: ${err.message}`);
      setProjects([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // First try to fetch projects
        await fetchProjectsInfo();
        // Only fetch previews if projects fetch was successful
        if (!error) {
          await fetchFlowerPreviews();
        }
      } catch (err) {
        console.error('Error in loadData:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <Header />
        <Hero>
          <PageTitle>Carregando Projetos...</PageTitle>
        </Hero>
      </>
    );
  }

  if (error) {
    return (
      <>
        <GlobalStyle />
        <Header />
        <Hero>
          <PageTitle>Erro ao carregar projetos</PageTitle>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <p>{error}</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{errorDetails}</p>
            <p style={{ marginTop: '20px' }}>
              Verifique se o arquivo info.json está disponível no bucket S3 do Amplify.
            </p>
          </div>
        </Hero>
      </>
    );
  }

  const projectsToDisplay = projects.map((project, index) => {
    // Remove leading slash if present and get directory name
    const directory = project.dir.replace(/^\//, '');
    
    // Create an array of 3 image URLs for this project
    const previewImages = [0, 1, 2].map(imgIndex => 
      `${baseApiUrl}/files/image/${directory}/${imgIndex}`
    );
    
    return {
      title: directory,
      description: `Projeto de ${project.owner}`,
      imageUrls: previewImages, // Array of image URLs for the collage
      linkTo: `/project?project=${directory}`, // Changed to match the Project component route
      linkText: "Ver Projeto",
      owner: project.owner,
      users: project.users
    };
  });

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
            {projectsToDisplay.length > 0 ? (
              projectsToDisplay.map((project, index) => (
                <ProjectCard
                  key={`project-${index}`}
                  title={project.title}
                  description={project.description}
                  imageUrls={project.imageUrls} // Pass all image URLs to ProjectCard
                  linkTo={project.linkTo}
                  linkText={project.linkText}
                  owner={project.owner}
                  users={project.users}
                />
              ))
            ) : (
              <p>Nenhum projeto encontrado.</p>
            )}
          </ProjectsContainer>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App
