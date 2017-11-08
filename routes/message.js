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
};

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
};

exports.agenda = ({ params: { id } }, res, next) => {
    messageLib.agenda(id, (err, response) => {
       if (err) {
           next(err);
       } 
    });
};

exports.getAllByUserId = ({ query, user }, res, next) => {
    const filter = { 'sender.user_id': user.id };
    messageLib.get(filter, query, (err, msgList) => {
       if  (err) {
           return res.status(500).send({
              error: `Erreur msg: ${err.error}` 
           });
       } 
       
       if (!msgList) {
           return res.status(204).send({message: 'empty request'});
       }
       
       return res.json({ msgList });
    });
};

exports.getById = ({ params: { id }, query, user }, res, next) => {
    const filter = { 'sender.user_id': user.id, '_id' : id };
    messageLib.get(filter, query, (err, msg) => {
        if (err) {
            return res.status(500).send({
              error: `Erreur msg: ${err.error}` 
            });
        } 
        
        if (!msg) {
           return res.status(204).send({message: 'empty request'});
        }

        return res.json({ msg });
    });
};

exports.getAdmin = ({ query }, res, next) => {
    messageLib.get(query.query, query, (err, msgList) => {
        if (err) {
            return res.status(500).send({
               error: `Erreur msg: ${err.error}` 
            });
        }
        
        if (!msg) {
            return res.status(204).send({message: 'empty request'});
        }
        
        return res.json({ msgList });
    });
};

exports.getByIdAdmin = ({ params: { id }, query }, res, next) => {
    const filter = { '_id' : id };
    messageLib.get( filter, query, (err, msgList) => {
        if (err) {
            return res.status(500).send({
               error: `Erreur msg: ${err.error}` 
            });
        }
        
        if (!msg) {
            return res.status(204).send({message: 'empty request'});
        }
        
        return res.json({ msgList });
    });
};

exports.delById = ({ params: { id }, query, user }, res, next) => {
    const filter = { 'sender.user_id': user.id, '_id' : id };
    messageLib.del(filter, query, (err, msg) => {
        if (err) {
            return res.status(500).send({
              error: `Erreur msg: ${err.error}` 
            });
        } 
        
        if (!msg) {
           return res.status(204).send({message: 'empty request'});
        }
        
        return res.status(200).send({ message: 'Message supprimé' });
    });
};

exports.delByIdAdmin = ({ params: { id }, query, user }, res, next) => {
    const filter = { '_id' : id };
    messageLib.del(filter, query, (err, msg) => {
        if (err) {
            return res.status(500).send({
              error: `Erreur msg: ${err.error}` 
            });
        } 
        
        if (!msg) {
           return res.status(204).send({message: 'empty request'});
        }
        
        return res.status(200).send({ message: 'Message supprimé' });
    });
};

