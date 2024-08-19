import SibApiV3Sdk from 'sib-api-v3-sdk';
import axios from 'axios';

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

      if (existingContact) {
        console.log('Existing contact:', existingContact);
        console.log('Existing contact list IDs:', existingContact.listIds);
        const newsletterId = parseInt(process.env.BREVO_NEWSLETTER_ID);
        console.log('Newsletter ID:', newsletterId);

        const listIds = existingContact.listIds.map(id => parseInt(id));
        console.log('Parsed list IDs:', listIds);

        if (listIds.includes(newsletterId)) {
          console.log('Contact is already subscribed to the newsletter.');
          return res.status(200).json({ message: 'You are already subscribed' });
        } else {
          // Add to the newsletter list
          await apiInstance.updateContact(email, {
            listIds: [...existingContact.listIds, newsletterId]
          });
          console.log('Contact updated successfully');

          // Send welcome email
          try {
            await axios.post('/api/sendWelcomeEmail', { email, firstname, lastname });
            console.log('Welcome email sent successfully');
          } catch (err) {
            console.error('Error sending welcome email:', err);
          }

          return res.status(200).json({ message: 'Subscription updated successfully' });
        }
      } else {
        // Create a new contact
        let createContact = new SibApiV3Sdk.CreateContact();
        createContact.email = email;
        createContact.attributes = { FIRSTNAME: firstname, LASTNAME: lastname };
        createContact.listIds = [parseInt(process.env.BREVO_NEWSLETTER_ID)];

        await apiInstance.createContact(createContact);
        console.log('Contact created successfully');

        // Send welcome email
        try {
          await axios.post('/api/sendWelcomeEmail', { email, firstname, lastname });
          console.log('Welcome email sent successfully');
        } catch (err) {
          console.error('Error sending welcome email:', err);
        }

        return res.status(200).json({ message: 'Successfully subscribed!' });
      }
    } catch (error) {
      console.error('Error adding contact to Brevo:', error.response ? error.response.data : error.message, error);
      return res.status(500).json({ message: 'Error adding contact to Brevo', error: error.response ? error.response.data : error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}