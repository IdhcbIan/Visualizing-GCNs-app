import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Card = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; // Three equal columns
  gap: 8px;
  
  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
    grid-template-columns: 1fr 1fr 1fr; // Maintain three columns on mobile
    gap: 4px; // Smaller gap on mobile
    padding: 8px;
    
    img {
      height: 100px; // Smaller height on mobile
    }
  }
`;

const ContentContainer = styled.div`
  flex: 2;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  color: #2a3b4c;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-family: 'Unna', serif;
`;

const Description = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const StyledLink = styled(Link)`
  align-self: flex-start;
  padding: 0.6rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Unna', serif;
  background-color: #4287f5;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const OwnerInfo = styled.div`
  margin-top: auto;
  color: #718096;
  font-size: 0.9rem;
`;

const ProjectCard = ({ title, description, imageUrls = [], linkTo, linkText, owner, users }) => {
  // Ensure we have at least 3 image URLs, use the first one as fallback
  const safeImageUrls = imageUrls.length >= 3 
    ? imageUrls 
    : [imageUrls[0] || '', imageUrls[0] || '', imageUrls[0] || ''];
  
  return (
    <Card
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        {safeImageUrls.map((url, index) => (
          <img 
            key={`preview-${index}`}
            src={url}
            alt={`Preview ${index + 1} for ${title}`}
          />
        ))}
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <StyledLink to={linkTo}>{linkText}</StyledLink>
        <OwnerInfo>
          <p>Criado por: {owner}</p>
          {users && users.length > 0 && (
            <p>Colaboradores: {users.join(', ')}</p>
          )}
        </OwnerInfo>
      </ContentContainer>
    </Card>
  );
};

export default ProjectCard;

