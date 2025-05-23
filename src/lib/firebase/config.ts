
// src/lib/firebase/config.ts

// Early check for essential Firebase environment variables
const requiredKeysAndPurpose: { key: string, purpose: string }[] = [
  { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', purpose: 'API Key for Firebase services' },
  { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', purpose: 'Authentication domain' },
  { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', purpose: 'Project Identifier' },
  { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', purpose: 'Storage bucket for file uploads' },
  { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', purpose: 'Cloud Messaging sender ID' },
  { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', purpose: 'Application Identifier' },
];

let allRequiredKeysPresent = true;

// This check runs when the module is loaded, typically on server start.
if (typeof process !== 'undefined' && process.env) {
  console.log("\n[FormFlow Firebase DEBUG] Performing Firebase config checks (src/lib/firebase/config.ts)...");
  console.log("[FormFlow Firebase DEBUG] These checks run when the server starts or this module is first loaded.");
  console.log("[FormFlow Firebase DEBUG] If variables are reported missing, ensure your '.env.local' file is in the project root, correctly formatted, and that you have RESTARTED your Next.js development server.\n");

  requiredKeysAndPurpose.forEach(({ key, purpose }) => {
    console.log(`[FormFlow Firebase DEBUG] Checking for ${key} (${purpose})...`);
    if (!process.env[key]) {
      console.error(`[FormFlow Firebase DEBUG] CRITICAL WARNING: Environment variable ${key} is MISSING.`);
      allRequiredKeysPresent = false;
    } else {
      console.log(`[FormFlow Firebase DEBUG] Environment variable ${key} is PRESENT (starts with: ${process.env[key]?.substring(0, 5)}...).`);
    }
  });

  if (!allRequiredKeysPresent) {
    console.error("\n[FormFlow Firebase DEBUG] CRITICAL ERROR: One or more required Firebase environment variables are missing from the server's environment. Firebase WILL FAIL to initialize correctly.");
    console.error("[FormFlow Firebase DEBUG] PLEASE VERIFY THE FOLLOWING:");
    console.error("  1. Your '.env.local' file exists in the project ROOT directory.");
    console.error("  2. It contains all necessary NEXT_PUBLIC_FIREBASE_... variables with correct values from your Firebase project console.");
    console.error("  3. You have COMPLETELY RESTARTED your Next.js development server (e.g., Ctrl+C and then 'npm run dev').\n");
  } else {
    console.log("\n[FormFlow Firebase DEBUG] All required Firebase environment variables seem to be present in the server's environment. Proceeding to build firebaseConfig.\n");
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
