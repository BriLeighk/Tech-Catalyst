import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    try {
      let existingContact = await apiInstance.getContactInfo(email);

      if (existingContact) {
        const isSubscribed = existingContact.listIds.includes(parseInt(process.env.BREVO_NEWSLETTER_ID));
        res.status(200).json({ isSubscribed });
      } else {
        res.status(200).json({ isSubscribed: false });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error checking subscription', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}