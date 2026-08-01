import { db } from '../../app/admin'; // Ensure the correct path to admin.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      const usersRef = db.collection('users');
      const querySnapshot = await usersRef.where('email', '==', email).get();

      if (!querySnapshot.empty) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      const firestoreMissing =
        error.code === 5 ||
        error.code === 'NOT_FOUND' ||
        error.reason === 'SERVICE_DISABLED' ||
        (typeof error.message === 'string' &&
          (error.message.includes('SERVICE_DISABLED') ||
            error.message.includes('Cloud Firestore API')));

      if (firestoreMissing) {
        res.status(503).json({
          error:
            'Firestore is not set up for this Firebase project. Create a Firestore database in the Firebase Console, then retry.',
        });
        return;
      }

      res.status(500).json({ error: 'Error checking email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}