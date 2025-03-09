import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../Legos/Header';

// Styled components for the UI
const ProjectContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const ProjectTitle = styled.h1`
  color: #2a3b4c;
  font-size: 2.5rem;
  font-family: 'Unna', serif;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

// New layout components
const ContentLayout = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  flex: 3;
`;

const RightColumn = styled.div`
  flex: 2;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const SelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const ImageContainer = styled.div`
  margin-bottom: 2rem;
`;

const ProjectImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ImageSelect = styled.select`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background-color: white;
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4287f5;
    box-shadow: 0 0 0 3px rgba(66, 135, 245, 0.2);
  }
`;

const ProjectInfoCard = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  
  h3 {
    color: #2a3b4c;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 1rem;
    font-family: 'Unna', serif;
  }
  
  p {
    color: #4a5568;
    margin-bottom: 0.5rem;
  }
`;

const MetadataItem = styled.div`
  margin-bottom: 0.75rem;
  
  strong {
    display: inline-block;
    min-width: 120px;
    color: #2d3748;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4a5568;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #e53e3e;
  max-width: 600px;
  margin: 0 auto;
`;

const RunsContainer = styled.div`
  margin-top: 1rem;
`;

const RunItem = styled.div`
  padding: 0.75rem;
  background-color: white;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  border-left: 3px solid #4287f5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RunTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #2a3b4c;
  font-size: 1.1rem;
`;

const RunMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #718096;
`;

const RunStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => 
    props.status === 'completed' ? '#C6F6D5' : 
    props.status === 'running' ? '#BEE3F8' : 
    props.status === 'failed' ? '#FED7D7' : 
    '#EDF2F7'};
  color: ${props => 
    props.status === 'completed' ? '#22543D' : 
    props.status === 'running' ? '#2A4365' : 
    props.status === 'failed' ? '#822727' : 
    '#4A5568'};
`;

const RunButtonContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ModelSelect = styled.select`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  background-color: white;
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4287f5;
    box-shadow: 0 0 0 3px rgba(66, 135, 245, 0.2);
  }
`;

const RunButton = styled.button`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background-color: #4287f5;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #3a76d8;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
    transform: none;
  }
`;

function Project() {
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('project');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState('alexnet');
  const [isRunning, setIsRunning] = useState(false);
  
  // Determine if we're in production or development
  const isProduction = window.location.hostname.includes('amplifyapp.com');
  const baseApiUrl = isProduction 
    ? 'https://nvlqzt2dsb.execute-api.sa-east-1.amazonaws.com/main/api' 
    : 'http://15.228.252.194:5000/api';

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectName) {
        setError('No project specified');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch project info from the API
        const infoResponse = await fetch(`${baseApiUrl}/files/info?requesttype=1`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors',
          cache: 'no-cache'
        });
        
        if (!infoResponse.ok) {
          throw new Error(`Failed to fetch project info: ${infoResponse.status}`);
        }
        
        const infoData = await infoResponse.json();
        
        if (infoData.status !== 'success') {
          throw new Error(`API returned error: ${infoData.message || 'Unknown error'}`);
        }
        
        // Find the project in the returned data
        let projectInfo = null;
        let projectsData = [];
        
        if (Array.isArray(infoData.data)) {
          projectsData = infoData.data;
        } else if (infoData.data && Array.isArray(infoData.data.projects)) {
          projectsData = infoData.data.projects;
        } else if (infoData.data && typeof infoData.data === 'object') {
          projectsData = [infoData.data];
        }
        
        // Find the project that matches our projectName
        projectInfo = projectsData.find(p => {
          const dir = p.dir.replace(/^\//, '');
          return dir === projectName;
        });
        
        if (!projectInfo) {
          throw new Error(`Project "${projectName}" not found`);
        }
        
        // Set project data
        setProjectData({
          title: projectName,
          description: `Project by ${projectInfo.owner}`,
          owner: projectInfo.owner,
          users: projectInfo.users || []
        });
        
        // Fetch all files with pagination support
        let allFiles = [];
        let nextToken = null;
        let hasMoreFiles = true;
        
        // Keep fetching until we have all files
        while (hasMoreFiles) {
          // Construct the URL with pagination token if available
          let filesUrl = `${baseApiUrl}/files`;
          if (nextToken) {
            filesUrl += `?continuation=${encodeURIComponent(nextToken)}`;
          }
          
          const filesResponse = await fetch(filesUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
          });
          
          if (!filesResponse.ok) {
            throw new Error(`Failed to fetch files list: ${filesResponse.status}`);
          }
          
          const filesData = await filesResponse.json();
          
          if (filesData.status !== 'success') {
            throw new Error(`API returned error when fetching files: ${filesData.message || 'Unknown error'}`);
          }
          
          // Add the files from this page to our collection
          allFiles = [...allFiles, ...filesData.files];
          
          // Check if there are more files to fetch
          if (filesData.next_token) {
            nextToken = filesData.next_token;
          } else {
            hasMoreFiles = false;
          }
          
          // Safety check to prevent infinite loops
          if (allFiles.length > 10000) {
            console.warn('Reached maximum file count (10000), stopping pagination');
            hasMoreFiles = false;
          }
        }
        
        console.log(`Total files fetched: ${allFiles.length}`);
        
        // Filter files to only include those from the current project directory
        // and only include image files
        const projectPrefix = `public/${projectName}/`;
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        
        const projectImages = allFiles
          .filter(file => {
            const key = file.key;
            // Check if the file is in the project directory
            if (!key.startsWith(projectPrefix)) return false;
            
            // Check if it's an image file
            return imageExtensions.some(ext => key.toLowerCase().endsWith(ext));
          })
          .map((file, index) => {
            // Extract just the filename from the full path
            const filename = file.key.split('/').pop();
            
            return {
              id: index,
              key: file.key,
              name: filename,
              size: file.size,
              lastModified: file.last_modified,
              // Create URL for the image
              url: `${baseApiUrl}/files/${file.key}`
            };
          });
        
        console.log(`Found ${projectImages.length} images for project ${projectName}`);
        
        // Sort files by name for consistency
        projectImages.sort((a, b) => a.name.localeCompare(b.name));
        
        setImageFiles(projectImages);
        
        // Set the first image as selected by default if there are any images
        if (projectImages.length > 0) {
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectName, baseApiUrl]);

  const handleImageChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedImageIndex(index);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleRunModel = () => {
    setIsRunning(true);
    
    // Here you would make an API call to start the model run
    // For now, we'll just simulate a run with a timeout
    console.log(`Starting run with model: ${selectedModel} on project: ${projectName}`);
    
    setTimeout(() => {
      console.log(`Run completed for model: ${selectedModel}`);
      setIsRunning(false);
      // In a real implementation, you would fetch the updated runs data here
    }, 2000);
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingMessage>Loading project data...</LoadingMessage>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <ErrorMessage>
          <h2>Error</h2>
          <p>{error}</p>
          <p>Please check the URL and try again.</p>
        </ErrorMessage>
      </>
    );
  }

  if (!projectData) {
    return (
      <>
        <Header />
        <ErrorMessage>
          <h2>Project Not Found</h2>
          <p>The requested project could not be found.</p>
        </ErrorMessage>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProjectContainer>
        <ProjectTitle>{projectData.title}</ProjectTitle>
        <ProjectDescription>{projectData.description}</ProjectDescription>
        
        <ContentLayout>
          <LeftColumn>
            {imageFiles.length > 0 && (
              <ImageSection>
                <SelectContainer>
                  <label htmlFor="image-select">Select an image:</label>
                  <ImageSelect 
                    id="image-select"
                    value={selectedImageIndex}
                    onChange={handleImageChange}
                  >
                    {imageFiles.map((image, index) => (
                      <option key={image.id} value={index}>
                        {image.name} ({(image.size / 1024).toFixed(1)} KB)
                      </option>
                    ))}
                  </ImageSelect>
                </SelectContainer>
                
                <ImageContainer>
                  <ProjectImage 
                    src={imageFiles[selectedImageIndex].url} 
                    alt={imageFiles[selectedImageIndex].name} 
                    onError={(e) => {
                      console.error(`Failed to load image: ${imageFiles[selectedImageIndex].url}`);
                      setImageFiles(prev => prev.filter((_, i) => i !== selectedImageIndex));
                      if (imageFiles.length > 1) {
                        setSelectedImageIndex(0);
                      }
                    }}
                  />
                </ImageContainer>
              </ImageSection>
            )}
            
            {imageFiles.length === 0 && (
              <p>No images found for this project.</p>
            )}
          </LeftColumn>
          
          <RightColumn>
            <ProjectInfoCard>
              <h3>Project Information</h3>
              <MetadataItem>
                <strong>Owner:</strong> {projectData.owner}
              </MetadataItem>
              
              {projectData.users && projectData.users.length > 0 && (
                <MetadataItem>
                  <strong>Collaborators:</strong> {projectData.users.join(', ')}
                </MetadataItem>
              )}
            </ProjectInfoCard>
            
            {imageFiles.length > 0 && selectedImageIndex >= 0 && (
              <ProjectInfoCard>
                <h3>Image Details</h3>
                <MetadataItem>
                  <strong>Filename:</strong> {imageFiles[selectedImageIndex].name}
                </MetadataItem>
                <MetadataItem>
                  <strong>Size:</strong> {(imageFiles[selectedImageIndex].size / 1024).toFixed(1)} KB
                </MetadataItem>
                <MetadataItem>
                  <strong>Last Modified:</strong> {imageFiles[selectedImageIndex].lastModified}
                </MetadataItem>
              </ProjectInfoCard>
            )}
            
            <ProjectInfoCard>
              <h3>Project Runs</h3>
              
              <RunButtonContainer>
                <label htmlFor="model-select">Select model to run:</label>
                <ModelSelect 
                  id="model-select"
                  value={selectedModel}
                  onChange={handleModelChange}
                  disabled={isRunning}
                >
                  <option value="alexnet">AlexNet</option>
                  <option value="resnet">ResNet</option>
                  <option value="transformer">Transformer</option>
                  <option value="dinov2">DINOv2</option>
                </ModelSelect>
                
                <RunButton 
                  onClick={handleRunModel}
                  disabled={isRunning || imageFiles.length === 0}
                >
                  {isRunning ? 'Running...' : 'Start New Run'}
                </RunButton>
              </RunButtonContainer>
              
              <RunsContainer>
                {/* This section will be populated with runs data from the API in the future */}
                <p>No runs data available yet.</p>
                
                {/* Example of how runs might look when data is available */}
                {/*
                <RunItem>
                  <RunTitle>Classification Run</RunTitle>
                  <RunMeta>
                    <span>Started: 2023-06-15 14:30</span>
                    <RunStatus status="completed">Completed</RunStatus>
                  </RunMeta>
                </RunItem>
                <RunItem>
                  <RunTitle>Feature Extraction</RunTitle>
                  <RunMeta>
                    <span>Started: 2023-06-14 09:15</span>
                    <RunStatus status="running">Running</RunStatus>
                  </RunMeta>
                </RunItem>
                */}
              </RunsContainer>
            </ProjectInfoCard>
          </RightColumn>
        </ContentLayout>
      </ProjectContainer>
    </>
  );
}

export default Project;
