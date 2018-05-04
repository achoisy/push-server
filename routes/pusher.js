const _ = require('lodash');

const pusherLib = require('../lib/pusher');

function createPusherObject({
    pusher_name = null,
    description = null,
    logo = null,
    main_email = null,
    visible_by = 'all',
}) {
    return { pusher_name,description,logo,main_email, visible_by };
}

exports.create = ({
    body
}, res, next) => {
    const pusherObjects = createPusherObject(body);

    if (_.every(pusherObjects, pusherObject => pusherObject!== null)) {
        pusherLib.add(pusherObjects, (liberr, newPusher) => {
            if (liberr) {
                return res.status(500).json({ create: false, message:`Erreur à /route/pusher.js/createNewPusher:pusherLib.add msg:${JSON.stringify(liberr)}`});
            } else {
                return res.json({
                    create: true,
                    newPusher,
                });
            }
            
        })
    } else {
        return res.status(422).json({ create: false, message: 'Vous devez fournir les champs obligatoires'});
    }
};

exports.getList = ({
    querymen: {
        query,
        cursor,
    }
}, res, next) => {
    pusherLib.getAll(query, cursor, (err, pusherList) => {
        if (err) {
            return res.status(500).send(`Erreur msg: ${JSON.stringify(err)}`);
        }

        if (!pusherList) {
            return res.status(204).json({ get: false, message: 'empty request' });
        }
        // TODO: Should not return all info to user !!!!
        return res.json({ get: true, pusherList});
    });
}