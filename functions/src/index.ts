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

import React, { useEffect } from 'react';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';



// admin.initializeApp();

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

  export const removePassengerFromDriver = functions.firestore
  .document('Drivers/{driverId}/Passengers/{passengerId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data() as { Going?: boolean, DriverIdentifier?: string, PassengerName?: string };
    const afterData = change.after.data() as { Going?: boolean, DriverIdentifier?: string, PassengerName?: string };

    if (beforeData.Going === true && afterData.Going === false) {
      // The 'Going' field changed from true to false

      // Get the driver's unique identifier from the passenger document
      const driverIdentifier = afterData.DriverIdentifier;
      const passengerName = afterData.PassengerName;

      if (driverIdentifier) {
        // Update the driver document to remove the passenger's name from the 'Passengers' array
        const driverRef = admin.firestore().collection('Drivers').doc(driverIdentifier);

        return admin.firestore().runTransaction(async (transaction) => {
          const driverDoc = await transaction.get(driverRef);
          const driverData = driverDoc.data() as { Passengers: string[] };

          // Remove the passenger's name from the 'Passengers' array
          const updatedPassengers = driverData.Passengers.filter(name => name !== passengerName);

          // Update the 'Passengers' array in the driver document
          transaction.update(driverRef, { Passengers: updatedPassengers });
        });
      }
    }

    return null;
  });

