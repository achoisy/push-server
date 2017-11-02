const config = require('config');
const postmark = require("postmark");



const email = module.exports = {
  sendmail: ({ headings, contents, create_date }, email_to, validation_url, callback) => {

    // Send an email:
    const client = new postmark.Client("3ded953e-0bb0-4cf2-b996-3b6a10b968ac"); // TODO: use config

    client.sendEmailWithTemplate({
        "From": "contact@maville.me",
        "To": email_to,
        "TemplateId": 3763462,
        "TemplateModel": {
            "product_name": "product_name_Value",
            "message_url": "message_url_Value",
            "heading": headings,
            "contents": contents,
            "action_url": validation_url,
            "date": create_date // TODO: use momentjs to have humain date format
        }
    }, (err, response) => {
        if (err) { return callback(err);}
        
        return callback();
    });
  },
};