import SibApiV3Sdk from 'sib-api-v3-sdk';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, isSubscribed } = req.body;

    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new SibApiV3Sdk.ContactsApi();

    try {
      console.log(`Updating subscription for email: ${email}, isSubscribed: ${isSubscribed}`);
      
      const newsletterId = parseInt(process.env.BREVO_NEWSLETTER_ID);
      console.log(`BREVO_NEWSLETTER_ID: ${newsletterId}`);

      let existingContact;
      try {
        existingContact = await apiInstance.getContactInfo(email);
        console.log(`Existing contact: ${JSON.stringify(existingContact)}`);
      } catch (error) {
        if (error.status === 404) {
          console.log('Contact does not exist, creating new contact.');
          existingContact = null;
        } else {
          throw error;
        }
      }

      if (existingContact) {
        if (isSubscribed) {
          // Add to the newsletter list
          const updatedListIds = [...new Set([...existingContact.listIds, newsletterId])];
          console.log(`Adding to list IDs: ${updatedListIds}`);
          await apiInstance.updateContact(email, { listIds: updatedListIds });
        } else {
          // Remove from the newsletter list
          console.log(`Removing from list ID: ${newsletterId}`);
          const removePayload = { emails: [email] };
          await apiInstance.removeContactFromList(newsletterId, removePayload);
          
          // Verify the update
          const updatedContact = await apiInstance.getContactInfo(email);
          console.log(`Updated contact after removal: ${JSON.stringify(updatedContact)}`);
          if (!updatedContact.listIds.includes(newsletterId)) {
            console.log(`Successfully removed from list ID: ${newsletterId}`);
          } else {
            console.error(`Failed to remove from list ID: ${newsletterId}`);
          }
        }
        res.status(200).json({ message: 'Subscription updated successfully' });
      } else {
        // Create a new contact and add to the newsletter list if subscribing
        if (isSubscribed) {
          let createContact = new SibApiV3Sdk.CreateContact();
          createContact.email = email;
          createContact.listIds = [newsletterId];

          await apiInstance.createContact(createContact);
          res.status(200).json({ message: 'Contact created and subscription updated successfully' });
        } else {
          res.status(404).json({ message: 'Contact not found' });
        }
      }
    } catch (error) {
      console.error('Error updating subscription:', error); // Log the error
      res.status(500).json({ message: 'Error updating subscription', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}