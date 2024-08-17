import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json'; // Update this path to the location of your JSON file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // No need to specify databaseURL for Firestore
  });
}

const db = admin.firestore();

export { admin, db };