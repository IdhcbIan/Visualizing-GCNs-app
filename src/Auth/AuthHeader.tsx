import { 
  Button,
  useAuthenticator
} from '@aws-amplify/ui-react';
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  padding: 1rem;
  background-color: #2a3b4c;
  width: 100%;
  border-bottom: 1px solid rgba(66, 135, 245, 0.3);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  margin: 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WelcomeText = styled.span`
  color: white;
`;

const StyledButton = styled(Button)`
  background-color: #068743;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #056935;
    transform: translateY(-1px);
  }
`;

interface AuthHeaderProps {}

export const AuthHeader: React.FC<AuthHeaderProps> = () => {
  const { user, signOut, toSignIn } = useAuthenticator((context) => [
    context.user,
    context.signOut,
    context.toSignIn
  ]);
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <AppTitle></AppTitle>
        
        {user ? (
          <UserSection>
            <WelcomeText>Welcome, {user.username || (user.attributes && user.attributes.email) || 'User'}</WelcomeText>
            <StyledButton onClick={() => signOut()}>Sign Out</StyledButton>
          </UserSection>
        ) : (
          <StyledButton onClick={() => toSignIn()}>Sign In</StyledButton>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default AuthHeader;
