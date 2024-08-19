import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstname, lastname } = req.body;

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    try {
      let existingContact;
      try {
        existingContact = await apiInstance.getContactInfo(email);
        console.log('Existing contact:', existingContact);
      } catch (error) {
        if (error.status === 404) {
          console.log('Contact does not exist, creating new contact.');
          existingContact = null;
        } else {
          throw error;
        }
      }

      if (!existingContact) {
        let createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = email;
        createContact.attributes = { FIRSTNAME: firstname, LASTNAME: lastname };
        createContact.listIds = [parseInt(process.env.BREVO_REGISTER_ID)];

        await apiInstance.createContact(createContact);
        console.log('Contact created successfully');
      } else {
        console.log('Contact already exists, skipping creation.');
      }

      res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
      console.error('Error adding contact to Brevo:', error.response ? error.response.data : error.message, error);
      res.status(500).json({ message: 'Error adding contact to Brevo', error: error.response ? error.response.data : error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}