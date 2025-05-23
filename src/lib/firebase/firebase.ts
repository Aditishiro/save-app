
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
// THIS IS FOR DIAGNOSTIC PURPOSES. CONSIDER REMOVING IN PRODUCTION.
console.log("Attempting to initialize Firebase with the following configuration:", firebaseConfig);

if (!firebaseConfig.apiKey) {
  console.error("CRITICAL: Firebase API Key is missing in the configuration passed to initializeApp. Firebase will fail to initialize.");
} else {
  console.log("Firebase API Key found in config object. If errors persist, ensure it's the correct key for your project and has no restrictions preventing its use from this origin/app.");
}


if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization error:", e);
    // Rethrow or handle as appropriate for your app's startup
    throw e;
  }
} else {
  app = getApps()[0]!;
}

auth = getAuth(app);
db = getFirestore(app);

if (typeof window !== 'undefined') {
  // Initialize Performance and Analytics only on the client side
  try {
    performance = getPerformance(app);
  } catch (e) {
    console.warn("Firebase Performance Monitoring could not be initialized:", e);
  }
  
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn("Firebase Analytics (including Crashlytics for web) could not be initialized:", e);
      }
    } else {
      // console.warn("Firebase Analytics is not supported in this environment."); // This can be noisy
    }
  }).catch(e => {
    console.warn("Error checking Firebase Analytics support:", e);
  });
}

export { app, auth, db, performance, analytics };
