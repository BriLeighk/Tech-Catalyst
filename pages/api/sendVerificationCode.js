import SibApiV3Sdk from 'sib-api-v3-sdk';
import { db } from '../../app/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstname, lastname, password } = req.body; // Include password
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi(); // Ensure apiInstance is defined
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Generate the verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/Verify?code=${verificationCode}`;

    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.templateId = parseInt(process.env.BREVO_VERIFICATION_TEMPLATE_ID);
    sendSmtpEmail.params = { 
      VERIFICATION_CODE: verificationCode, 
      VERIFICATION_LINK: verificationLink,
      FIRSTNAME: firstname, // Ensure firstname is passed
      LASTNAME: lastname // Ensure lastname is passed
    };

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);

      // Store verification code, user details, and password temporarily in Firestore
      const docRef = doc(db, 'verifications', verificationCode);
      console.log('Document Reference:', docRef.path); // Log document reference path
      await setDoc(docRef, {
        email,
        firstname,
        lastname,
        password, // Store password
        verificationCode, // Store verification code
        timestamp: new Date()
      });

      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ message: 'Error sending verification email', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}