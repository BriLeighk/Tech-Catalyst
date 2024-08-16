import SibApiV3Sdk from 'sib-api-v3-sdk';
import { db } from '../../app/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstname, lastname } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.templateId = parseInt(process.env.BREVO_VERIFICATION_TEMPLATE_ID);
    sendSmtpEmail.params = { VERIFICATION_CODE: verificationCode };

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);

      // Store verification code and user details temporarily in Firestore
      await setDoc(doc(db, 'verifications', email), {
        email,
        firstname,
        lastname,
        verificationCode,
        timestamp: new Date()
      });

      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending verification email', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}