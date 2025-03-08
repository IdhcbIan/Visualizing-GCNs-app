import React, { useEffect } from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import styled from 'styled-components';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

function Login() {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  
  // Use effect to navigate after successful login
  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  return (
    <LoginContainer>
      <Authenticator>
        {({ signOut }) => (
          <div>
            <h2>You are logged in!</h2>
            <p>Redirecting to home page...</p>
          </div>
        )}
      </Authenticator>
    </LoginContainer>
  );
}

export default Login;
