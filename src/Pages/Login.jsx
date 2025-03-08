import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <Authenticator>
        {({ user }) => {
          // Redirect to home page after successful login
          navigate('/');
          return null;
        }}
      </Authenticator>
    </div>
  );
}

export default Login;
