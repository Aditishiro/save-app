
// src/lib/firebase/config.ts

// Early check for essential Firebase environment variables
const requiredKeysAndPurpose: { key: string, purpose: string }[] = [
  { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', purpose: 'API Key for Firebase services' },
  { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', purpose: 'Authentication domain for your app' },
  { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', purpose: 'Your Firebase Project Identifier' },
  { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', purpose: 'Firebase Storage bucket for file uploads' },
  { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', purpose: 'Firebase Cloud Messaging sender ID' },
  { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', purpose: 'Firebase Application Identifier for this web app' },
  // measurementId is often optional for core functionality but good to include if using Analytics
  // { key: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID', purpose: 'Firebase Analytics Measurement ID (optional for core services)' },
];

let allRequiredKeysPresent = true;
const missingKeysDetails: string[] = [];

console.log("\n[FormFlow Firebase DEBUG] =================================================================================");
console.log("[FormFlow Firebase DEBUG] SERVER STARTUP: Firebase Config Check (src/lib/firebase/config.ts)");
console.log("[FormFlow Firebase DEBUG] This module is evaluated when the Next.js server starts or rebuilds.");
console.log("[FormFlow Firebase DEBUG] Checking if NEXT_PUBLIC_ environment variables are available to the server process...");
console.log("[FormFlow Firebase DEBUG] These variables should be defined in a .env.local file in your project root.");
console.log("[FormFlow Firebase DEBUG] =================================================================================");


if (typeof process !== 'undefined' && process.env) {
  requiredKeysAndPurpose.forEach(({ key, purpose }) => {
    const value = process.env[key];
    console.log(`[FormFlow Firebase DEBUG] Checking for environment variable: ${key} (Purpose: ${purpose})`);
    if (value === undefined || value === null || value === '') {
      const detail = `    - ${key} (Purpose: ${purpose}) IS MISSING OR EMPTY.`;
      missingKeysDetails.push(detail);
      console.error(`[FormFlow Firebase DEBUG] CRITICAL CONFIG WARNING: ${detail}`);
      allRequiredKeysPresent = false;
    } else {
      console.log(`[FormFlow Firebase DEBUG]   Environment variable ${key} is PRESENT (value starts with: ${String(value).substring(0, 5)}...).`);
    }
  });

  if (!allRequiredKeysPresent) {
    console.error("\n[FormFlow Firebase DEBUG] ============================ CRITICAL ERROR ================================");
    console.error("[FormFlow Firebase DEBUG] One or more Firebase environment variables (prefixed with NEXT_PUBLIC_)");
    console.error("[FormFlow Firebase DEBUG] are MISSING or EMPTY in the server's environment.");
    console.error("[FormFlow Firebase DEBUG] Missing variable(s) and their purposes:");
    missingKeysDetails.forEach(detail => console.error(detail));
    console.error("\n[FormFlow Firebase DEBUG] TO RESOLVE THIS:");
    console.error("  1. Ensure you have a file named '.env.local' in the ROOT directory of your project.");
    console.error("     (The same directory as your package.json file).");
    console.error("  2. Ensure this '.env.local' file contains all the required NEXT_PUBLIC_FIREBASE_... variables");
    console.error("     with their correct values copied EXACTLY from your Firebase project console.");
    console.error("     Example for NEXT_PUBLIC_FIREBASE_API_KEY: NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyYOURactualAPIkeyHERE");
    console.error("  3. You MUST **COMPLETELY RESTART** your Next.js development server after creating or modifying");
    console.error("     the '.env.local' file (e.g., Ctrl+C in the terminal, then 'npm run dev').");
    console.error("[FormFlow Firebase DEBUG] Firebase WILL NOT initialize correctly, and your application will not work");
    console.error("[FormFlow Firebase DEBUG] as expected until these environment variables are correctly loaded.");
    console.error("[FormFlow Firebase DEBUG] =================================================================================");
  } else {
    console.log("\n[FormFlow Firebase DEBUG] All required Firebase environment variables (NEXT_PUBLIC_...) appear to be present and loaded by the server process.");
    console.log("[FormFlow Firebase DEBUG] The firebaseConfig object will now be built using these values.");
    console.log("[FormFlow Firebase DEBUG] If Firebase initialization still fails, double-check the *values* of these keys in your .env.local file for typos against your Firebase console.");
    console.log("[FormFlow Firebase DEBUG] =================================================================================");
  }
} else {
  console.error("[FormFlow Firebase DEBUG] CRITICAL SYSTEM ERROR: `process.env` object is not available. This is highly unexpected in a Next.js environment. Firebase configuration cannot be loaded.");
  allRequiredKeysPresent = false; // Mark as failed because we can't check env vars
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};
