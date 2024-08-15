import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstname, lastname } = req.body;

    // Log the incoming request body
    console.log('Request body:', req.body);

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    // Log the API key and list ID to ensure they are set
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY);
    console.log('BREVO_REGISTER_ID:', process.env.BREVO_REGISTER_ID);

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    let createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = { FIRSTNAME: firstname, LASTNAME: lastname };
    createContact.listIds = [parseInt(process.env.BREVO_REGISTER_ID)];

    try {
      const response = await apiInstance.createContact(createContact);
      // Log the response from the API
      console.log('API response:', response);
      res.status(200).json({ message: 'Contact added successfully' });
    } catch (error) {
      // Log the error details
      console.error('Error adding contact:', error);
      res.status(500).json({ message: 'Error adding contact', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}