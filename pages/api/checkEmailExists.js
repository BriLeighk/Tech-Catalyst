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
      console.error('Error checking email:', error); // Log the error
      res.status(500).json({ error: 'Error checking email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}