import React from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4287f5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(66, 135, 245, 0.3);
  }
`;

const LoggedInUser = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  
  // Get user initials from email or username
  const getUserInitials = () => {
    if (!user) return '';
    
    const email = user.attributes?.email || '';
    const username = user.username || '';
    
    if (email) {
      return email.charAt(0).toUpperCase();
    } else if (username) {
      return username.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  return (
    <Container>
      <UserAvatar onClick={handleAvatarClick}>
        {getUserInitials()}
      </UserAvatar>
    </Container>
  );
};

export default LoggedInUser;
