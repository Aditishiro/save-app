
/**
 * @fileoverview Example of a Cloud Function for third-party integration, like sending a welcome email.
 * This uses an Auth trigger (on user creation).
 *
 * IMPORTANT:
 * - For real email sending, use services like SendGrid, Mailgun, or Firebase Extensions (e.g., "Trigger Email").
 * - Securely store API keys for third-party services using Firebase Functions environment configuration
 *   or Google Cloud Secret Manager. NEVER hardcode API keys.
 */

import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin'; // Not strictly needed for this example if just using user obj

// For a real email service, you'd import their SDK
// e.g., import * as sgMail from '@sendgrid/mail';

// Initialize Firebase Admin SDK (if you need to interact with Firestore/Auth further)
// if (admin.apps.length === 0) {
//   admin.initializeApp();
// }

/**
 * Auth-triggered function that sends a welcome email when a new user is created.
 */
export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName || 'New User'; // The display name of the user.

  if (!email) {
    console.log('User created without email, cannot send welcome email.');
    return null;
  }

  console.log(`New user signed up: ${email}, Display Name: ${displayName}`);

  // --- Mock Email Sending ---
  // In a real scenario, you would integrate with an email service here.
  // For example, with SendGrid:
  // const SENDGRID_API_KEY = functions.config().sendgrid?.key;
  // if (!SENDGRID_API_KEY) {
  //   console.error('SendGrid API key not configured. Set with: firebase functions:config:set sendgrid.key="YOUR_API_KEY"');
  //   return null;
  // }
  // sgMail.setApiKey(SENDGRID_API_KEY);
  //
  // const msg = {
  //   to: email,
  //   from: 'welcome@yourplatform.com', // Use a verified sender
  //   subject: `Welcome to Our Platform, ${displayName}!`,
  //   html: `<h1>Hello ${displayName},</h1><p>Welcome to our amazing platform! We're excited to have you.</p>`,
  // };
  //
  // try {
  //   await sgMail.send(msg);
  //   console.log('Welcome email sent to:', email);
  // } catch (error) {
  //   console.error('Error sending welcome email:', error);
  //   if (error.response) {
  //     console.error(error.response.body)
  //   }
  // }
  // --- End Mock Email Sending ---

  console.log(`Mock welcome email "sent" to ${email}. Subject: Welcome to Our Platform, ${displayName}!`);

  // You could also perform other actions here, like creating a user profile in Firestore.
  // For example:
  // try {
  //   await admin.firestore().collection('users').doc(user.uid).set({
  //     email: email,
  //     displayName: displayName,
  //     createdAt: admin.firestore.FieldValue.serverTimestamp(),
  //     tenantId: 'some_default_tenant_or_logic_to_assign', // Important for multi-tenancy
  //   });
  //   console.log(`User profile created in Firestore for ${user.uid}`);
  // } catch (dbError) {
  //   console.error(`Error creating user profile in Firestore for ${user.uid}:`, dbError);
  // }

  return null;
});

/**
 * Example HTTP-triggered function to call a Vertex AI endpoint (Conceptual)
 *
 * This is a conceptual outline. Actual implementation would involve:
 * - Setting up Vertex AI, deploying a model.
 * - Using Google Cloud client libraries for Vertex AI.
 * - Handling authentication to Vertex AI (usually via service account credentials inherent to Cloud Functions).
 * - Managing API keys/secrets for external services securely.
 */
export const callVertexAIModel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { prompt, modelEndpointId } = data; // Expecting some data from the client

  if (!prompt || typeof prompt !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'A valid prompt string is required.');
  }
  if (!modelEndpointId || typeof modelEndpointId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'A valid modelEndpointId string is required.');
  }

  console.log(`User ${context.auth.uid} requesting Vertex AI call for endpoint ${modelEndpointId} with prompt: "${prompt.substring(0, 50)}..."`);

  // Placeholder for actual Vertex AI SDK interaction
  //
  // import { PredictionServiceClient } from '@google-cloud/aiplatform';
  // const clientOptions = { apiEndpoint: 'YOUR_REGION-aiplatform.googleapis.com' };
  // const predictionServiceClient = new PredictionServiceClient(clientOptions);
  //
  // const endpoint = `projects/YOUR_PROJECT_ID/locations/YOUR_REGION/endpoints/${modelEndpointId}`;
  // const instances = [{ content: prompt }]; // Adjust based on your model's input format
  // const parameters = { temperature: 0.2, maxOutputTokens: 256, topP: 0.95, topK: 40 };
  //
  // const request = { endpoint, instances, parameters };
  //
  // try {
  //   const [response] = await predictionServiceClient.predict(request);
  //   if (response.predictions && response.predictions.length > 0) {
  //     const predictionResult = response.predictions[0]; // Adjust based on your model's output format
  //     console.log('Vertex AI Prediction:', predictionResult);
  //     return { success: true, prediction: predictionResult };
  //   } else {
  //     throw new Error('No predictions returned from Vertex AI.');
  //   }
  // } catch (error) {
  //   console.error('Error calling Vertex AI:', error);
  //   throw new functions.https.HttpsError('internal', 'Failed to get prediction from Vertex AI.');
  // }

  // Mock response
  const mockPrediction = `This is a mock AI response to your prompt: "${prompt}" for model ${modelEndpointId}.`;
  console.log("Returning MOCK Vertex AI response.");
  return { success: true, prediction: mockPrediction };
});
