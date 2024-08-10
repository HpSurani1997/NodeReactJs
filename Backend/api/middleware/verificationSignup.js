const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findAll({ where: { email: req.body.email } })
        .then(data => {
            if (data.length == 0) {
                next();
            } else {
                return res.status(400).send({
                    status: false,
                    message: "Failed! email is already in use!"
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                status: false,
                message: err.message || "Some error occurred while retrieving users."
            });
        });
};


const verificationUserId = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verificationUserId;


