import { firestore } from './firebaseAdmin'; // Ensure the correct path to firebaseAdmin.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { oobCode } = req.body;

    try {
        console.log('Checking link validity for oobCode:', oobCode);

        const customResetLink = `http://localhost:3000/ChangePassword?oobCode=${oobCode}`;
        const snapshot = await firestore.collection('passwordResetRequests')
            .where('resetLink', '==', customResetLink)
            .where('valid', '==', true)
            .get();

        if (snapshot.empty) {
            console.log('Link is invalid or expired');
            return res.status(200).json({ valid: false });
        }

        console.log('Link is valid');
        return res.status(200).json({ valid: true });
    } catch (error) {
        console.error('Error checking link validity:', error);
        return res.status(500).json({ message: 'Error checking link validity' });
    }
}