import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
`;

const ProfileCard = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  background-color: #2a3b4c;
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #4287f5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 2.5rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 1rem;
`;

const ProfileContent = styled.div`
  padding: 2rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2a3b4c;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.p`
  font-weight: bold;
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const InfoValue = styled.p`
  margin: 0.3rem 0 0 0;
  font-size: 1.1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4287f5' : '#f44336'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-color: ${props => props.primary ? '#3a76d8' : '#d32f2f'};
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const Profile = () => {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.signOut
  ]);
  const navigate = useNavigate();
  
  console.log('Profile component rendered', user);
  
  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user found, redirecting to login');
    navigate('/login');
    return null;
  }
  
  // Get user initials from email or username
  const getUserInitials = () => {
    const email = user.attributes?.email || '';
    const username = user.username || '';
    
    if (email) {
      return email.charAt(0).toUpperCase();
    } else if (username) {
      return username.charAt(0).toUpperCase();
    }
    
    return 'U';
  };
  
  const handleSignOut = () => {
    signOut();
    navigate('/');
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <ProfileContainer>
      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserInfo>
            <UserName>{user.username || 'User'}</UserName>
          </UserInfo>
        </ProfileHeader>
        
        <ProfileContent>
          <ProfileSection>
            <SectionTitle>Account Information</SectionTitle>
            <InfoItem>
              <InfoLabel>User ID</InfoLabel>
              <InfoValue>{user.userId || user.username}</InfoValue>
            </InfoItem>
          </ProfileSection>
          
          <ButtonContainer>
            <Button primary onClick={handleBack} style={{ marginRight: '1rem' }}>
              Back to Home
            </Button>
            <Button onClick={handleSignOut}>
              Sign Out
            </Button>
          </ButtonContainer>
        </ProfileContent>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
