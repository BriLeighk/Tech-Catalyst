import { firestore } from './firebaseAdmin'; // Ensure the correct path to firebaseAdmin.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { oobCode } = req.body;

    try {
        const snapshot = await firestore.collection('passwordResetRequests')
            .where('resetLink', '==', `http://localhost:3000/ChangePassword?oobCode=${oobCode}`)
            .get();

        if (!snapshot.empty) {
            const docId = snapshot.docs[0].id;
            await firestore.collection('passwordResetRequests').doc(docId).update({ valid: false });
        }

        return res.status(200).json({ message: 'Password reset link invalidated' });
    } catch (error) {
        console.error('Error invalidating link:', error);
        return res.status(500).json({ message: 'Error invalidating link' });
    }
}