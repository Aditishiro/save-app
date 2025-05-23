
// src/lib/firebase/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let performance: FirebasePerformance | null = null;
let analytics: Analytics | null = null;

// Log the configuration object that will be used to initialize Firebase
// THIS IS FOR DIAGNOSTIC PURPOSES.
console.log("Attempting to initialize Firebase with the following configuration:", firebaseConfig);

// Perform a more explicit check for the API key *before* calling initializeApp
if (!firebaseConfig || !firebaseConfig.apiKey) {
  console.error("CRITICAL FIREBASE INIT ERROR: The firebaseConfig object is missing or the apiKey is not defined within it. This usually means the environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY from .env.local) were not loaded correctly or are missing.");
  console.error("Please ensure your .env.local file is correctly set up in the project root and that you have restarted your Next.js development server.");
  // To prevent the Firebase SDK from throwing its own error, we can stop execution here
  // or allow it to proceed so Firebase can log its specific error, which might also be helpful.
  // For now, we'll let Firebase try to initialize to see its specific error, but this log should appear first.
} else {
  console.log("Firebase API Key found in firebaseConfig object. If Firebase errors persist, ensure it's the correct key for your project and has no restrictions preventing its use from this origin/app.");
}


if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase app initialized successfully.");
  } catch (e) {
    console.error("Firebase initialization error during initializeApp(firebaseConfig):", e);
    // Rethrow or handle as appropriate for your app's startup
    throw e;
  }
} else {
  app = getApps()[0]!;
  console.log("Firebase app already initialized, getting existing instance.");
}

auth = getAuth(app);
db = getFirestore(app);

if (typeof window !== 'undefined') {
  // Initialize Performance and Analytics only on the client side
  try {
    performance = getPerformance(app);
    console.log("Firebase Performance Monitoring initialized.");
  } catch (e) {
    console.warn("Firebase Performance Monitoring could not be initialized:", e);
  }
  
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
        console.log("Firebase Analytics initialized.");
      } catch (e) {
        console.warn("Firebase Analytics (including Crashlytics for web) could not be initialized:", e);
      }
    } else {
      // console.warn("Firebase Analytics is not supported in this environment."); 
    }
  }).catch(e => {
    console.warn("Error checking Firebase Analytics support:", e);
  });
}

export { app, auth, db, performance, analytics };
