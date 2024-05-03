import md5 from 'md5';
import mailchimp from '@mailchimp/mailchimp_marketing';
// const mailchimp = require('@mailchimp/mailchimp_marketing')

mailchimp.setConfig({
  apiKey: process.env.MAIL_CHIMP_API_KEY,
  server: process.env.MAIL_CHIMP_SERVER,
});

export default async function handler(req, res) {
  const email = req.body.email;
  if (!email) {
    res.status(404).json({ error: 'Email not found' });
  } else {
    const subscriber_hash = md5(email);
    await mailchimp.lists.setListMember(
      process.env.MAIL_CHIMP_LIST_ID,
      subscriber_hash,
      {
        email_address: email,
        status_if_new: 'subscribed',
      }
    );

    res.status(200).json({ status: true, email });
  }
}

// const response = await client.lists.addListMember("a50847cf45", {
//     email_address: "Ebony_Brekke@gmail.com",
//     status: "pending",
//   });
//   console.log(response);
