// IMPORTANT:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Go to Project Settings -> General, and find your web app config.
// 3. Create a file named `.env` in the root of your project.
// 4. Add your Firebase config to the `.env` file like this:
//    VITE_FIREBASE_API_KEY="your-api-key"
//    VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
//    VITE_FIREBASE_PROJECT_ID="your-project-id"
//    VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
//    VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
//    VITE_FIREBASE_APP_ID="your-app-id"
// Note: In this environment, these are accessed via `process.env` not `import.meta.env`.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);