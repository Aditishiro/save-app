
// src/lib/firebase/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { firebaseConfig } from './config'; // Import the hardcoded config

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let performance: FirebasePerformance | null = null;
let analytics: Analytics | null = null;

// Log the configuration object that will be used to initialize Firebase
// This now comes directly from config.ts
console.log("[FormFlow Firebase DEBUG] Firebase config to be used (from config.ts):", JSON.stringify(firebaseConfig, null, 2));

// The explicit check for apiKey in firebaseConfig is less critical here as it's hardcoded,
// but we'll keep a basic check to ensure the object itself is not undefined.
if (!firebaseConfig || !firebaseConfig.apiKey) {
  const errorMessage = "[FormFlow Firebase CRITICAL INIT ERROR] The hardcoded firebaseConfig object in src/lib/firebase/config.ts is missing or the apiKey is not defined within it. Please check the hardcoded values.";
  console.error(errorMessage);
  // This will halt execution if config is critically flawed even when hardcoded.
  throw new Error(errorMessage);
} else {
  console.log("[FormFlow Firebase DEBUG] Hardcoded Firebase API Key found in firebaseConfig. Key starts with: ", firebaseConfig.apiKey.substring(0, 5) + "...");
}

if (getApps().length === 0) {
  try {
    console.log("[FormFlow Firebase DEBUG] Initializing Firebase app with hardcoded config. API key being used starts with: ", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + "..." : "API KEY IS MISSING/UNDEFINED IN HARDCODED CONFIG");
    app = initializeApp(firebaseConfig);
    console.log("[FormFlow Firebase DEBUG] Firebase app initialized successfully using hardcoded config.");
  } catch (e) {
    console.error("[FormFlow Firebase DEBUG] Firebase initialization error during initializeApp(firebaseConfig) with hardcoded config:", e);
    throw e;
  }
} else {
  app = getApps()[0]!;
  console.log("[FormFlow Firebase DEBUG] Firebase app already initialized, getting existing instance.");
}

auth = getAuth(app);
db = getFirestore(app);

if (typeof window !== 'undefined') {
  try {
    performance = getPerformance(app);
    console.log("[FormFlow Firebase DEBUG] Firebase Performance Monitoring initialized.");
  } catch (e) {
    console.warn("[FormFlow Firebase DEBUG] Firebase Performance Monitoring could not be initialized:", e);
  }

  isAnalyticsSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) { // Also check if measurementId is present
      try {
        analytics = getAnalytics(app);
        console.log("[FormFlow Firebase DEBUG] Firebase Analytics initialized.");
      } catch (e) {
        console.warn("[FormFlow Firebase DEBUG] Firebase Analytics could not be initialized:", e);
      }
    } else if (!firebaseConfig.measurementId) {
      console.log("[FormFlow Firebase DEBUG] Firebase Analytics not initialized because measurementId is missing in the hardcoded config.");
    } else {
      // console.log("[FormFlow Firebase DEBUG] Firebase Analytics is not supported in this environment.");
    }
  }).catch(e => {
    console.warn("[FormFlow Firebase DEBUG] Error checking Firebase Analytics support:", e);
  });
}

export { app, auth, db, performance, analytics };
