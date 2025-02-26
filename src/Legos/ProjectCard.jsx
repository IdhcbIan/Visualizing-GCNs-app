import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled(motion.div)`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex: 0 0 40%;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 200px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2a3b4c;
  font-family: 'Unna', serif;
`;

const Description = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #4287f5;
  font-weight: 600;
  margin-top: auto;
  align-self: flex-start;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProjectCard = ({ title, description, imageUrl, linkTo, linkText }) => {
  return (
    <Card
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <ImageContainer>
        <img src={imageUrl} alt={title} />
      </ImageContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <StyledLink to={linkTo}>{linkText || 'Learn More'}</StyledLink>
      </ContentContainer>
    </Card>
  );
};

export default ProjectCard;

