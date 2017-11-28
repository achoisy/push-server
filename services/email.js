const config = require('config');
const postmark = require('postmark');


const email = {
  sendmail: ({
    headings,
    contents,
    create_date,
  }, emailTo, validationUrl, callback) => {
    // Send an email:
    const client = new postmark.Client(config.get('Postmark.POSTMARK_API_KEY')); // TODO: use config

    client.sendEmailWithTemplate({
      From: 'contact@maville.me',
      To: emailTo,
      TemplateId: 3763462,
      TemplateModel: {
        product_name: 'product_name_Value',
        message_url: 'message_url_Value',
        heading: headings.fr,
        contents: contents.fr,
        action_url: validationUrl,
        date: create_date, // TODO: use momentjs to have humain date format
      },
    }, (err, response) => {
      console.log('Postmark response:', response);
      if (err) {
        return callback(err);
      }

      return callback();
    });
  },
};

module.exports = email;
