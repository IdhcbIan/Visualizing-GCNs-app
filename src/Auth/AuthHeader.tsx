import { 
  Button,
  useAuthenticator,
  View,
  Text
} from '@aws-amplify/ui-react';
import React from 'react';

interface AuthHeaderProps {}

export const AuthHeader: React.FC<AuthHeaderProps> = () => {
  const { user, signOut, toSignIn } = useAuthenticator((context) => [
    context.user,
    context.signOut,
    context.toSignIn
  ]);
  
  return (
    <View as="header" padding="1rem" backgroundColor="#f0f0f0" width="100%">
      <View display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.2rem" fontWeight="bold">My App</Text>
        
        {user ? (
          <View display="flex" alignItems="center" gap="1rem">
            <Text>Welcome, {user.username || (user.attributes && user.attributes.email) || 'User'}</Text>
            <Button variation="primary" size="small" onClick={() => signOut()}>Sign Out</Button>
          </View>
        ) : (
          <Button variation="primary" size="small" onClick={() => toSignIn()}>Sign In</Button>
        )}
      </View>
    </View>
  );
};

export default AuthHeader;
