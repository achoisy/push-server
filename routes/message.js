// route for message
const messageLib = require('../lib/message');

exports.create = ({ body, user }, res, next) => {
    // Create new message
    // Body: heading {}, contents {}, link[ type, url,description], deliver_date
    messageLib.addMessage(body, user, (err, message) => {
        if (err) {
          return res.status(500).send({ 
              error: `Erreur à /route/message create.messageLib.addMessage msg:${err.error}` 
          });
        }
        
        res.json({ message });
        
    });
}

exports.validate = ({ params: { id, token}}, res, next) => {
    // Validate message
    messageLib.validateMessage(id, token, (err, response) => {
       if (err) {
           return res.status(500).send({ 
               error: `Erreur à /route/message validate.messageLib.validateMessage msg:${err.error}`
           });
       } 
       
       res.json({ response }); // TODO: create response template in html. use mustach temp engine
    });
}