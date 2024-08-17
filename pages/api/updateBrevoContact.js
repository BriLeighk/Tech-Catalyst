import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstName, lastName } = req.body;

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.ContactsApi();
    const updateContact = new SibApiV3Sdk.UpdateContact();
    updateContact.attributes = { FIRSTNAME: firstName, LASTNAME: lastName };

    try {
      await apiInstance.updateContact(email, updateContact);
      res.status(200).json({ message: 'Brevo contact updated successfully.' });
    } catch (error) {
      console.error('Error updating Brevo contact:', error);
      res.status(500).json({ error: 'Error updating Brevo contact.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}