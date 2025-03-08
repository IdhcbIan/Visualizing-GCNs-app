import { 
  Authenticator,
  useAuthenticator,
  View
} from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';

Amplify.configure(outputs);

interface PageProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: PageProps) {
  return (
    <Authenticator.Provider>
      <AppContent Component={Component} pageProps={pageProps} />
    </Authenticator.Provider>
  );
}

// Separate component to use the useAuthenticator hook
function AppContent({ Component, pageProps }: PageProps) {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <>
      {user ? (
        <main>
          <Component {...pageProps} />
        </main>
      ) : (
        <Authenticator>
          {({ user }) => (
            <main>
              <Component {...pageProps} />
            </main>
          )}
        </Authenticator>
      )}
    </>
  );
}