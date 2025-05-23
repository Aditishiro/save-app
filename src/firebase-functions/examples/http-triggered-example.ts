
/**
 * @fileoverview Example of an HTTP-triggered Cloud Function for a component-specific API.
 * This function could be called by a "Contact Form" component to submit data securely.
 *
 * To deploy, you would typically:
 * 1. Ensure your `firebase-functions` project is set up (usually a separate directory or integrated).
 * 2. Install necessary dependencies (e.g., `firebase-admin`, `firebase-functions`).
 * 3. Add this code to your functions `index.ts` or a relevant file.
 * 4. Deploy using `firebase deploy --only functions`.
 */

import * as functions from 'firebase-functions';
import *nadmin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already done (typically in your functions' index.ts)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Example HTTP-triggered function to handle a contact form submission.
 *
 * A component would make a POST request to this function's URL.
 * For security, consider:
 * - Input validation (as shown).
 * - Authentication checks (e.g., `context.auth` if only logged-in users can submit).
 * - CORS configuration if calling from a different domain.
 * - Rate limiting.
 */
export const submitContactMessage = functions.https.onCall(async (data, context) => {
  // Optional: Check if the user is authenticated
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }

  const { name, email, message } = data;

  // Basic Input Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Name is required and must be a non-empty string.');
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) { // Simple email check
    throw new functions.https.HttpsError('invalid-argument', 'A valid email is required.');
  }
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required and must be a non-empty string.');
  }

  try {
    await db.collection('contactMessages').add({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      // userId: context.auth ? context.auth.uid : null, // Optional: store user ID if authenticated
    });
    return { success: true, message: 'Message received. Thank you!' };
  } catch (error)
    console.error('Error submitting contact message:', error);
    throw new functions.https.HttpsError('internal', 'Failed to submit message. Please try again later.');
  }
});

// Example of how a client-side component might call this function:
/*
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const submitContactMessageCallable = httpsCallable(functions, 'submitContactMessage');

async function handleSubmit(formData) {
  try {
    const result = await submitContactMessageCallable(formData);
    console.log(result.data.message); // { success: true, message: 'Message received...' }
  } catch (error) {
    console.error("Error calling submitContactMessage:", error);
    // Handle HTTPS error (error.code, error.message)
  }
}
*/
