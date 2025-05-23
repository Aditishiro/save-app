
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

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
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
        console.warn("Firebase Analytics (Crashlytics for web) could not be initialized:", e);
      }
    } else {
      console.warn("Firebase Analytics is not supported in this environment.");
    }
  }).catch(e => {
    console.warn("Error checking Firebase Analytics support:", e);
  });
}

export { app, auth, db, performance, analytics };
