// route for message
const messageLib = require('../lib/message');

exports.create = ({ body, user }, res, next) => {
    // Create new message
    // Body: heading {}, contents {}, link[ type, url,description], deliver_date
    
}

exports.validate = (req, res, next) => {
    // Validate message
}