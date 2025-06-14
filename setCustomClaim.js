// setCustomClaim.js
// This script sets the platformAdmin: true custom claim for a specified Firebase user.
// Ensure you have firebase-admin installed: npm install firebase-admin --save-dev
//
// How to use:
// 1. Ensure your Google Application Default Credentials are set up (e.g., by running `gcloud auth application-default login`)
//    OR download your project's service account key JSON file from Firebase Console > Project Settings > Service accounts.
// 2. If using a service account key, uncomment the serviceAccount lines and update the path.
// 3. Replace 'YOUR_ADMIN_UID_HERE' with the actual UID of the user you want to make a platform admin.
// 4. Run the script from your project root: `node setCustomClaim.js`

const admin = require('firebase-admin');

// Option 1: Use Application Default Credentials (recommended for Cloud environments or locally after `gcloud auth application-default login`)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Optional: if you need database access
});

// Option 2: Use a service account key file (uncomment and update path if needed)
/*
const serviceAccount = require("./path/to/your-service-account-key.json"); // <-- IMPORTANT: Update this path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Optional: if you need database access
});
*/

// The UID of the existing admin user you want to grant platformAdmin privileges
const uid = 'jLAdQGe0GbO8W9xlopOjyYyTniu2'; // Pre-filled with the UID you provided

if (!uid || uid === 'YOUR_ADMIN_UID_HERE') {
  console.error("Error: Please replace 'YOUR_ADMIN_UID_HERE' in the script with the actual user UID.");
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
    console.log("1. The user may need to sign out and sign back in for the new claims to take effect in their ID token.");
    console.log("2. Ensure your Firestore security rules are configured to check for `request.auth.token.platformAdmin == true`.");
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
