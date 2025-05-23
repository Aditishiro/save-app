
// src/lib/firebase/config.ts

// Hardcoded Firebase configuration provided by the user.
// WARNING: This is NOT recommended for production due to security risks.
// API keys and other sensitive information will be embedded in client-side code.
// Use environment variables for production deployments.

export const firebaseConfig = {
  apiKey: "AIzaSyC_ps8tdba2U3YwZ1WIpFJpcvNo3PjDSKY",
  authDomain: "formflow-finance-974db.firebaseapp.com",
  projectId: "formflow-finance-974db",
  storageBucket: "formflow-finance-974db.appspot.com", // Corrected common typo: .appspot.com
  messagingSenderId: "1055792580036",
  appId: "1:1055792580036:web:a9d4515d28625189699091",
  measurementId: "G-DXX3V3DRS1"
};

// The previous environment variable checking logic is removed as it's no longer used with hardcoded config.
console.log("[FormFlow Firebase DEBUG] Using HARDCODED Firebase configuration (src/lib/firebase/config.ts).");
console.warn("[FormFlow Firebase DEBUG] WARNING: Firebase configuration is hardcoded. This is NOT recommended for production environments due to security risks. Ensure this is only for local development or controlled testing.");

// To revert to using environment variables:
// 1. Remove the hardcoded firebaseConfig object above.
// 2. Restore the previous logic that read from process.env.NEXT_PUBLIC_FIREBASE_...
// 3. Ensure your .env.local file is correctly populated and your server is restarted.
