
/**
 * @fileoverview Example of a Firestore-triggered Cloud Function for data processing/transformation.
 * This function runs when a new document is created in a specific collection.
 *
 * Scenario: When a new product is added to a `/products` collection,
 * this function could create a summary document in a separate `/productSummaries` collection.
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Firestore-triggered function that runs when a new document is created in '/products'.
 * It creates a corresponding summary document.
 */
export const onNewProductCreateSummary = functions.firestore
  .document('/products/{productId}')
  .onCreate(async (snapshot, context) => {
    const productId = context.params.productId;
    const productData = snapshot.data();

    if (!productData) {
      console.error(`Product data undefined for productId: ${productId}`);
      return null;
    }

    console.log(`New product created (ID: ${productId}):`, productData);

    // Example: Basic data transformation/selection for summary
    const summaryData = {
      name: productData.name || 'Unnamed Product',
      price: productData.price || 0,
      category: productData.category || 'Uncategorized',
      createdAt: productData.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      // You might perform more complex transformations here
    };

    try {
      // Save the summary to a different collection or path
      await db.collection('productSummaries').doc(productId).set(summaryData);
      console.log(`Product summary created for productId: ${productId}`);
      return null;
    } catch (error) {
      console.error(`Error creating product summary for ${productId}:`, error);
      // Handle error (e.g., retry logic, logging to an error reporting service)
      return null;
    }
  });


/**
 * Example: Firestore-triggered function for data validation/sanitization
 * When a document is written to `/rawUserData/{userId}`, this function could validate and sanitize it.
 */
export const onRawUserDataWriteValidate = functions.firestore
    .document('/rawUserData/{userId}')
    .onWrite(async (change, context) => {
        // .onWrite is triggered on create, update, delete.
        // For this example, let's focus on create and update.
        if (!change.after.exists) {
            console.log(`Document ${context.params.userId} deleted from rawUserData. No action needed.`);
            return null;
        }

        const rawData = change.after.data();
        const userId = context.params.userId;

        if (!rawData) {
            console.log(`No data found for rawUserData/${userId} after write.`);
            return null;
        }

        const processedData: any = { ...rawData }; // Copy raw data

        // Example Sanitization/Validation
        if (processedData.email && typeof processedData.email === 'string') {
            processedData.email = processedData.email.trim().toLowerCase();
            // Add more robust email validation if needed
        }

        if (processedData.description && typeof processedData.description === 'string') {
            // Example: Truncate long descriptions
            const MAX_DESC_LENGTH = 200;
            if (processedData.description.length > MAX_DESC_LENGTH) {
                processedData.description = processedData.description.substring(0, MAX_DESC_LENGTH) + "...";
            }
            // Example: Basic "bad word" filter (very simplistic, use a library for real scenarios)
            // processedData.description = processedData.description.replace(/badword/ig, '*******');
        }

        // Update the document in place or write to a different collection
        // For this example, let's assume we update in place IF changes were made.
        // A more robust pattern might be to write to `/processedUserData/{userId}`
        // and delete from `/rawUserData/{userId}` or mark as processed.

        // Check if any data was actually changed by sanitization
        const hasChanges = JSON.stringify(rawData) !== JSON.stringify(processedData);

        if (hasChanges) {
            try {
                // Update the original document with sanitized data
                await change.after.ref.set(processedData, { merge: true });
                console.log(`Sanitized data for rawUserData/${userId}`);
            } catch (error) {
                console.error(`Error updating sanitized data for ${userId}:`, error);
            }
        } else {
            console.log(`No sanitization changes needed for rawUserData/${userId}`);
        }
        return null;
    });
