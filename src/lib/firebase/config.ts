// src/lib/firebase/config.ts

// Early check for essential Firebase environment variables
const requiredKeys: string[] = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

let allRequiredKeysPresent = true;
if (typeof window === 'undefined') { // Perform checks server-side or during build
  console.log("Performing Firebase config checks...");
  requiredKeys.forEach(key => {
    if (!process.env[key]) {
      console.warn(`Firebase config warning: Environment variable ${key} is missing. Firebase might not initialize correctly or fully.`);
      allRequiredKeysPresent = false;
    }
  });

  if (!allRequiredKeysPresent) {
    console.error("CRITICAL: One or more required Firebase environment variables are missing. Please check your .env.local file (and ensure it's loaded by restarting the dev server if needed) and your Firebase project settings.");
  } else {
    console.log("All required Firebase environment variables seem to be present.");
  }
}


export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Measurement ID is optional for core services
};
