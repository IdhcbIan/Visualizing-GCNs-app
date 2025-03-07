import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myAppStorage',
  access: (allow) => ({
    // Public read access for all files in the "public" folder
    public: allow.guest().read('public/*'),
    
    // Authenticated users can read/write their own files
    authenticated: allow.authenticated().readWrite('${user}/*'),
    
    // Admin users can access all files
    admin: allow.groups(['admin']).readWriteDelete('*'),
  }),
});
