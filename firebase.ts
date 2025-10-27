// IMPORTANT:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Go to Project Settings -> General, and find your web app config.
// 3. Replace the placeholder values below with your actual Firebase config.
//    This is required for the application to connect to Firebase.

export const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_FIREBASE_APP_ID",
};

/**
 * Checks if the Firebase configuration is complete.
 * This synchronous check prevents Firebase SDKs from being imported and
 * initialized with placeholder values, which would cause the application to crash.
 * @returns {boolean} - True if the configuration is valid, false otherwise.
 */
export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  (value) => typeof value === 'string' && value.includes("REPLACE_")
);
