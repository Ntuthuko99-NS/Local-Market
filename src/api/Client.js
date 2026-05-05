// Import the function that creates a client
import { createClient } from 'some-sdk';

// Import your app configuration
import { appParams } from './app-params';

// Extract the values you need from your config
const appId = appParams.appId;
const token = appParams.token;
const functionsVersion = appParams.functionsVersion;
const appBaseUrl = appParams.appBaseUrl;

// Create and export your client
export const client = createClient({
  appId: appId,
  token: token,
  functionsVersion: functionsVersion,
  serverUrl: '',        // Leave empty if not needed
  requiresAuth: false,  // Change to true if authentication is required
  appBaseUrl: appBaseUrl
});
