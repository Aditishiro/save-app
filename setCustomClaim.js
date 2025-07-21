// setCustomClaim.js
// This script sets the platformAdmin: true custom claim for a specified Firebase user.
// Ensure you have firebase-admin installed: npm install firebase-admin --save-dev
//
// How to use:
// 1. Ensure your Google Application Default Credentials are set up (e.g., by running `gcloud auth application-default login`)
//    OR download your project's service account key JSON file from Firebase Console > Project Settings > Service accounts.
// 2. If using a service account key, uncomment the serviceAccount lines and update the path.
// 3. The admin UID is pre-filled with 'jLAdQGe0GbO8W9xlopOjyYyTniu2'. If you need to change it, update the `uid` constant.
// 4. Run the script from your project root: `node setCustomClaim.js`

const admin = require('firebase-admin');

// Option 1: Use Application Default Credentials (recommended for Cloud environments or locally after `gcloud auth application-default login`)
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Optional: if you need database access
  });
} catch (e) {
  console.error("Failed to initialize Firebase Admin with Application Default Credentials. Make sure you've run 'gcloud auth application-default login' or set up a service account key.", e);
  process.exit(1);
}


// Option 2: Use a service account key file (uncomment and update path if needed)
/*
try {
    const serviceAccount = require("./path/to/your-service-account-key.json"); // <-- IMPORTANT: Update this path
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Optional: if you need database access
    });
} catch (e) {
    console.error("Failed to initialize Firebase Admin with Service Account. Ensure the path is correct and the file is valid.", e);
    process.exit(1);
}
*/

// The UID of the existing admin user you want to grant platformAdmin privileges
const uid = 'jLAdQGe0GbO8W9xlopOjyYyTniu2'; // Pre-filled with the UID you provided

if (!uid) {
  console.error("Error: The UID constant in the script is empty. Please provide the user UID.");
  process.exit(1);
}

// Set the custom claim
admin.auth().setCustomUserClaims(uid, { platformAdmin: true })
  .then(() => {
    console.log(`Successfully set 'platformAdmin: true' custom claim for UID: ${uid}`);
    // Verify by fetching the user record
    return admin.auth().getUser(uid);
  })
  .then(userRecord => {
    console.log('Updated custom claims for user:', userRecord.customClaims);
    console.log("\nNext Steps:");
    console.log("1. The user MUST SIGN OUT and SIGN BACK IN for the new claims to take effect in their ID token.");
    console.log("2. Ensure your Firestore security rules are deployed and configured to check for `request.auth.token.platformAdmin == true`.");
    process.exit(0); // Exit successfully
  })
  .catch(error => {
    console.error('Error setting custom claim for UID:', uid, error);
    if (error.code === 'auth/user-not-found') {
      console.error(`\nError: User with UID "${uid}" was not found. Please verify the UID.`);
    } else if (error.message && error.message.includes("Unable to detect a Project Id")) {
      console.error("\nError: Firebase Admin SDK could not detect a Project ID. This usually means Application Default Credentials are not set up correctly, or the service account key is missing/invalid if you're using that method.");
      console.error("Please ensure you've run 'gcloud auth application-default login' or correctly configured a serviceAccount key in the script.");
    }
    process.exit(1); // Exit with an error code
  });
