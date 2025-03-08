import { 
  Authenticator,
  useAuthenticator
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