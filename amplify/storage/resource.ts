import { defineStorage } from '@aws-amplify/backend';
import { allow } from '@aws-amplify/backend-storage';

export const storage = defineStorage({
  name: 'myAppStorage',
  access: () => ({
    // Public read access for all files in the "public" folder
    public: allow.guest().to.read('public/*'),
    
    // Authenticated users can read/write their own files
    authenticated: allow.authenticated().to.readWrite('${user}/*'),
    
    // Admin users can access all files
    admin: allow.groups(['admin']).to.readWrite('*'),
  }),
});
