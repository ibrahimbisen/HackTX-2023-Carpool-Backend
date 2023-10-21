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
  .document('Passengers/{Passenger Name}')
  .onCreate(async (snapshot, context) => {
    const passengerData = snapshot.data() as { passengerName: string, driverName: string }; // Define the data type of the passenger document.
    const driverId = passengerData.driverName; // Assuming you store the driver's ID in the passenger document.

    // Get the driver's document reference.
    const driverRef = admin.firestore().collection('Drivers').doc(driverId);

    // Update the driver's array to add the passenger's name (or other details).
    return driverRef.update({
      passengers: admin.firestore.FieldValue.arrayUnion(passengerData.passengerName)
    });
  });