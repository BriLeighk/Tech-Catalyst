import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.templateId = 2; // Template ID for the newsletter email

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      res.status(200).json({ message: 'Newsletter email sent successfully' });
    } catch (error) {
      console.error('Error sending newsletter email:', error);
      res.status(500).json({ message: 'Error sending newsletter email', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}