import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    try {
      // Check if the contact already exists
      let existingContact = await apiInstance.getContactInfo(email);

      if (existingContact) {
        // Add to the newsletter list
        await apiInstance.updateContact(email, {
          listIds: [parseInt(process.env.BREVO_NEWSLETTER_ID)]
        });
      } else {
        // Create a new contact
        let createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = email;
        createContact.listIds = [parseInt(process.env.BREVO_NEWSLETTER_ID)];

        await apiInstance.createContact(createContact);
      }

      res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding contact', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}