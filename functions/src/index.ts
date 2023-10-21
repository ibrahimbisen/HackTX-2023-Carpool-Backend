/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const addPassengerToDriver = functions.firestore
  .document('Drivers/{driverId}/Passengers/{passengerId}')
  .onCreate(async (snapshot, context) => {
    const passengerData = snapshot.data() as { passengerName: string };
    const driverId = context.params.driverId;
    const driverRef = admin.firestore().collection('Drivers').doc(driverId);

    // Update the driver document with passenger data
    return driverRef.update({
      Passengers: admin.firestore.FieldValue.arrayUnion(passengerData)
    });
  });
