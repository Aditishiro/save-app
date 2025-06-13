
// src/lib/firebase/config.ts

// Hardcoded Firebase configuration.
// It is STRONGLY recommended to use environment variables for production deployments
// to avoid exposing sensitive keys in client-side code.

export const firebaseConfig = {
  apiKey: "AIzaSyC_ps8tdba2U3YwZ1WIpFJpcvNo3PjDSKY",
  authDomain: "formflow-finance-974db.firebaseapp.com",
  projectId: "formflow-finance-974db",
  storageBucket: "formflow-finance-974db.appspot.com",
  messagingSenderId: "1055792580036",
  appId: "1:1055792580036:web:a9d4515d28625189699091",
  measurementId: "G-DXX3V3DRS1"
};

// This log helps confirm which configuration source is active.
// The console warning about hardcoding is intentional and important.
console.log("[FormFlow Firebase DEBUG] Using HARDCODED Firebase configuration (src/lib/firebase/config.ts) for project: ", firebaseConfig.projectId);
if (firebaseConfig.projectId !== "formflow-finance-974db") {
    console.error("[FormFlow Firebase CRITICAL CONFIG MISMATCH] projectId in config.ts is NOT 'formflow-finance-974db'. It is: ", firebaseConfig.projectId);
}
console.warn("[FormFlow Firebase DEBUG] WARNING: Firebase configuration is hardcoded. This is NOT recommended for production environments due to security risks. Ensure this is only for local development or controlled testing.");
