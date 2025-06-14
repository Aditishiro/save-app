
/**
 * @fileoverview Example Cloud Function for automating tenant provisioning.
 *
 * This function demonstrates how to:
 * - Trigger on new Firebase Authentication user creation.
 * - Set custom claims for the new user (tenantId, roles, platformAdmin).
 * - Create initial Firestore documents for the tenant.
 *
 * IMPORTANT:
 * - This is a simplified example. Real-world tenant creation might be more complex,
 *   potentially involving a separate signup flow for an organization, then inviting users.
 * - For actual Identity Platform tenant creation, you'd use admin.auth().tenantManager().createTenant(...).
 *   This example focuses on setting claims and Firestore docs.
 * - Error handling and idempotency should be robust in production.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK (if not already done in your functions' index.ts)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// Define the email address for the global platform administrator
const PLATFORM_ADMIN_EMAIL = 'testadmin@example.com';

/**
 * Auth-triggered function that runs when a new Firebase user is created.
 * It sets up initial tenant information and custom claims.
 */
export const onNewUserSetupTenant = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  if (!email) {
    console.log(`User ${uid} created without an email. Skipping tenant setup.`);
    return null;
  }

  // For this example, we'll use the user's UID as their initial tenantId.
  // In a multi-user-per-tenant system, tenantId would likely come from an
  // organization signup process or an invitation.
  const tenantId = uid; // Simplification: user's UID becomes their tenant ID.

  const customClaims: { [key: string]: any } = {
    tenantId: tenantId,
    roles: ['tenant_admin'], // Assign a default role for their own tenant
  };

  // Check if the new user is the designated platform admin
  if (email.toLowerCase() === PLATFORM_ADMIN_EMAIL.toLowerCase()) {
    customClaims.platformAdmin = true;
    console.log(`User ${uid} (${email}) is designated platform admin. Setting platformAdmin claim.`);
  } else {
    customClaims.platformAdmin = false; // Explicitly set to false for non-admins
  }

  try {
    // 1. Set custom claims for the user.
    // This is crucial for Firebase Security Rules to enforce tenant isolation and admin privileges.
    await admin.auth().setCustomUserClaims(uid, customClaims);
    console.log(`Custom claims set for user ${uid}:`, customClaims);

    // 2. Create a tenant metadata document in Firestore.
    // This document represents the "tenant" itself, which in this simplified model is tied to the user.
    const tenantDocRef = db.collection('tenants').doc(tenantId);
    await tenantDocRef.set({
      id: tenantId,
      name: displayName || `${email}'s Organization` || `Tenant ${tenantId}`,
      adminUids: [uid], // This user is the initial admin of their tenant.
      subscriptionStatus: 'trial', // Default status
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Tenant document created for tenantId: ${tenantId}`);

    // 3. Create a user profile document within that tenant's subcollection.
    const tenantUserDocRef = db.collection('tenants').doc(tenantId).collection('users').doc(uid);
    await tenantUserDocRef.set({
      id: uid,
      email: email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      roles: customClaims.roles, // Store roles here for easier client-side checks if needed
      isPlatformAdmin: customClaims.platformAdmin === true, // Denormalize for easy lookup
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Tenant user profile created for user ${uid} under tenant ${tenantId}`);

    // (Optional) Create a default platform for the new tenant
    const platformDocRef = db.collection('platforms').doc(); // Auto-generate platform ID
    await platformDocRef.set({
        id: platformDocRef.id,
        tenantId: tenantId,
        name: `${displayName || 'My First'} Platform`,
        description: 'Default platform created on tenant setup.',
        status: 'draft',
        platformAdmins: [uid], // User is admin of their own default platform
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastModified: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Default platform ${platformDocRef.id} created for tenant ${tenantId}`);


    return null;
  } catch (error) {
    console.error(`Error during new user tenant setup for ${uid} (tenantId: ${tenantId}):`, error);
    // Consider cleanup actions if partial setup occurred.
    return null;
  }
});

