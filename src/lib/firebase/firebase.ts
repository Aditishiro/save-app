
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
let performanceInstance: FirebasePerformance | null = null; // Renamed to avoid conflict
let analyticsInstance: Analytics | null = null; // Renamed to avoid conflict

// Log the configuration object that will be used to initialize Firebase
// THIS IS FOR DIAGNOSTIC PURPOSES.
console.log("[FormFlow Firebase DEBUG] Attempting to initialize Firebase with the following configuration:", JSON.stringify(firebaseConfig, null, 2));

// Perform a more explicit check for the API key *before* calling initializeApp
if (!firebaseConfig || !firebaseConfig.apiKey) {
  const errorMessage = "[FormFlow Firebase CRITICAL INIT ERROR] The firebaseConfig object is missing or the apiKey is not defined within it. This usually means the environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY from .env.local) were not loaded correctly or are missing. Please ensure your .env.local file is correctly set up in the project root and that you have restarted your Next.js development server.";
  console.error(errorMessage);
  // For server-side, console.error is appropriate.
  // If this needs to halt client-side execution, throwing an error here would be necessary.
} else {
  console.log("[FormFlow Firebase DEBUG] Firebase API Key found in firebaseConfig object. Key starts with: ", firebaseConfig.apiKey.substring(0, 5) + "..."); // Log a snippet
}


if (getApps().length === 0) {
  try {
    // Log the key being used immediately before initialization
    console.log("[FormFlow Firebase DEBUG] Initializing Firebase app. API key being used starts with: ", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + "..." : "API KEY IS MISSING/UNDEFINED AT THIS POINT");
    app = initializeApp(firebaseConfig);
    console.log("[FormFlow Firebase DEBUG] Firebase app initialized successfully.");
  } catch (e) {
    console.error("[FormFlow Firebase DEBUG] Firebase initialization error during initializeApp(firebaseConfig):", e);
    // Rethrow or handle as appropriate for your app's startup
    throw e;
  }
} else {
  app = getApps()[0]!;
  console.log("[FormFlow Firebase DEBUG] Firebase app already initialized, getting existing instance.");
}

auth = getAuth(app);
db = getFirestore(app);

if (typeof window !== 'undefined') {
  // Initialize Performance and Analytics only on the client side
  try {
    performanceInstance = getPerformance(app);
    console.log("[FormFlow Firebase DEBUG] Firebase Performance Monitoring initialized.");
  } catch (e) {
    console.warn("[FormFlow Firebase DEBUG] Firebase Performance Monitoring could not be initialized:", e);
  }
  
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      try {
        analyticsInstance = getAnalytics(app);
        console.log("[FormFlow Firebase DEBUG] Firebase Analytics initialized.");
      } catch (e) {
        console.warn("[FormFlow Firebase DEBUG] Firebase Analytics (including Crashlytics for web) could not be initialized:", e);
      }
    } else {
      // console.warn("Firebase Analytics is not supported in this environment."); 
    }
  }).catch(e => {
    console.warn("[FormFlow Firebase DEBUG] Error checking Firebase Analytics support:", e);
  });
}

// Export the initialized instances using the renamed local variables
export { app, auth, db, performanceInstance as performance, analyticsInstance as analytics };
