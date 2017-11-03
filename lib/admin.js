const Admin = require('../models/admin');

exports.add = ({ login, email, password }, callback) => {
  // Ajoute un nouveau user dans User
  Admin.findOne({ login }).exec()
    .then((existingUser) => {
      if (existingUser) {
        return null;
      }

      const admin = new Admin({
        login,
        password,
        email,
      });

      return admin.save();
    })
    .then((admin) => {
      if (!admin) {
        callback({ error: 'Login is in use' }, null);
      }

      callback(null, admin);
    })
    .catch((err) => {
      callback({ error: err }, null);
    });
};

exports.delete = (adminId, callback) =>{
    Admin.findByIdAndRemove(adminId).exec()
    .then((deleleAdmin) => {
        if (!deleteAdmin) {
            throw new Error(`admin_id:${adminId} don't exist`);
        }
        
        callback(null, deleteAdmin);
    })
    .catch((err) => {
       callback({ error: err.message }, null); 
    });
};
