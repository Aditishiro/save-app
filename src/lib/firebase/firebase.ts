
// src/lib/firebase/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore'; // Corrected persistence import
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from 'firebase/analytics';
import { firebaseConfig } from './config'; // Import the hardcoded config

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let performance: FirebasePerformance | null = null;
let analytics: Analytics | null = null;

// This log helps confirm which configuration source is active.
console.log("[FormFlow Firebase DEBUG] Using HARDCODED Firebase configuration (from config.ts).");
console.warn("[FormFlow Firebase DEBUG] WARNING: Firebase configuration is hardcoded. This is NOT recommended for production environments due to security risks. Ensure this is only for local development or controlled testing.");


if (!firebaseConfig || !firebaseConfig.apiKey) {
  const errorMessage = "[FormFlow Firebase CRITICAL INIT ERROR] The hardcoded firebaseConfig object in src/lib/firebase/config.ts is missing or the apiKey is not defined within it. Please check the hardcoded values and ensure your .env.local file is correctly set up if you intend to switch back. Review server-side logs from config.ts for more details if environment variables were expected. Restart your Next.js server after any changes to .env.local.";
  console.error(errorMessage);
  // This error will halt execution if the config is critically flawed.
  // Making it more prominent for easier debugging by the user.
  if (typeof window !== 'undefined') {
    // For client-side, ensure this error is highly visible
    document.body.innerHTML = `<div style="color: red; background: white; padding: 20px; font-family: sans-serif; font-size: 1.5em; border: 5px solid red;">${errorMessage}</div>`;
  }
  throw new Error(errorMessage);
} else {
  console.log("[FormFlow Firebase DEBUG] Hardcoded Firebase API Key found in firebaseConfig. Key starts with: ", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + "..." : "API KEY IS MISSING/UNDEFINED IN HARDCODED CONFIG");
}


if (getApps().length === 0) {
  try {
    console.log("[FormFlow Firebase DEBUG] Initializing Firebase app with hardcoded config. API key being used starts with: ", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + "..." : "API KEY IS MISSING/UNDEFINED IN HARDCODED CONFIG");
    app = initializeApp(firebaseConfig);
    console.log("[FormFlow Firebase DEBUG] Firebase app initialized successfully using hardcoded config.");
  } catch (e: any) {
    console.error("[FormFlow Firebase DEBUG] Firebase initialization error during initializeApp(firebaseConfig) with hardcoded config:", e.message, e.stack);
    if (typeof window !== 'undefined') {
       document.body.innerHTML = `<div style="color: red; background: white; padding: 20px; font-family: sans-serif; font-size: 1.5em; border: 5px solid red;">Firebase Initialization Error: ${e.message}</div>`;
    }
    throw e;
  }
} else {
  app = getApps()[0]!;
  console.log("[FormFlow Firebase DEBUG] Firebase app already initialized, getting existing instance.");
}

auth = getAuth(app);
db = getFirestore(app);

// Enable Firestore offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db) // Corrected function call
    .then(() => {
      console.log("[FormFlow Firebase DEBUG] Firestore offline persistence enabled using IndexedDB.");
    })
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn("[FormFlow Firebase DEBUG] Firestore offline persistence failed-precondition: Multiple tabs open, persistence can only be enabled in one tab at a time.");
      } else if (err.code === 'unimplemented') {
        console.warn("[FormFlow Firebase DEBUG] Firestore offline persistence unimplemented: The current browser does not support all of the features required to enable persistence.");
      } else {
        console.error("[FormFlow Firebase DEBUG] Firestore offline persistence failed: ", err);
      }
    });
}


if (typeof window !== 'undefined') {
  try {
    performance = getPerformance(app);
    console.log("[FormFlow Firebase DEBUG] Firebase Performance Monitoring initialized.");
  } catch (e) {
    console.warn("[FormFlow Firebase DEBUG] Firebase Performance Monitoring could not be initialized:", e);
  }

  isAnalyticsSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
        console.log("[FormFlow Firebase DEBUG] Firebase Analytics initialized.");
      } catch (e) {
        console.warn("[FormFlow Firebase DEBUG] Firebase Analytics could not be initialized:", e);
      }
    } else if (!firebaseConfig.measurementId) {
      console.log("[FormFlow Firebase DEBUG] Firebase Analytics not initialized because measurementId is missing in the hardcoded config.");
    }
  }).catch(e => {
    console.warn("[FormFlow Firebase DEBUG] Error checking Firebase Analytics support:", e);
  });
}

export { app, auth, db, performance, analytics };
