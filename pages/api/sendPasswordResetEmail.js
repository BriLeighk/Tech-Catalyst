import { auth, firestore } from './firebaseAdmin'; // Ensure the correct path to firebaseAdmin.js
import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    console.log('Received request:', { email });

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Generate the password reset link using Firebase Admin SDK
        const resetLink = await auth.generatePasswordResetLink(email);
        console.log('Generated reset link:', resetLink);

        // Modify the reset link to point to your custom ChangePassword page
        const url = new URL(resetLink);
        const oobCode = url.searchParams.get('oobCode');
        const customResetLink = `http://localhost:3000/ChangePassword?oobCode=${oobCode}`;

        // Store the reset request in Firestore
        const resetRequest = {
            email,
            resetLink: customResetLink,
            createdAt: new Date(),
            valid: true
        };
        await firestore.collection('passwordResetRequests').add(resetRequest);

        let defaultClient = SibApiV3Sdk.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.to = [{ email }];
        sendSmtpEmail.templateId = 5; // Brevo template ID for password reset
        sendSmtpEmail.params = { resetLink: customResetLink };

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Error sending password reset email', error: error.message });
    }
}