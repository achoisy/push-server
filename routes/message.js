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
               error: `Erreur msg:${err.error}`
           });
       } 
       
       res.status(200).send("Merci pour la validation"); // TODO: create response template in html. use mustach temp engine
       next();
    });
}

exports.agenda = ({ params: { id } }, res, next) => {
    messageLib.agenda(id, (err, response) => {
       if (err) {
           next(err);
       } 
    });
}
