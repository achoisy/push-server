const Pusher = require('../models/pusher');

exports.add = ({
    pusher_name,
    description,
    logo,
    main_email, 
    visible_by
}, callback) => {
    Pusher.findOne({ pusher_name }).exec()
    .then((existingPusher) => {
        if (existingPusher) {
            return null;
        }

        const pusher = new Pusher({
            pusher_name,
            description,
            logo,
            main_email, 
            visible_by
        });

        return pusher.save();
    })
    .then((pusher) =>{
        if (!pusher) {
            return callback({error: "Pusher deja existant!"}, false);
        }

        return callback(null, pusher);
    })
    .catch((err) => {
       return callback({error: err }, null);
    });
};

exports.getAll = (query, {
    sort = {
        pusher_name:1,
    },
    limit = 50,
    skip = 0,
}, callback) => {
    Pusher.find(query).limit(limit).skip(skip).sort(sort)
    .exec()
    .then((pusherList) => {
        if (!pusherList) {
           return callback(null, false);
        }
        return callback(null, pusherList);
    })
    .catch((err) => {
       return callback({
            error: err
        }, null);
    });
}