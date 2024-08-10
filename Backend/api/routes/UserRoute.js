const { authJwt, verifySignUp } = require("../middleware");

module.exports = app => {
    const users = require("../controllers/UserController.js");

    app.post("/api/user/register", [verifySignUp.checkDuplicateUsernameOrEmail], users.create);

    app.post("/api/user/login", users.login);

    app.get("/api/user/getProfile", [authJwt.verifyToken], users.getProfile);

    app.post("/api/user/forgotPassword", users.forgotPassword);

    app.post("/api/user/verifyOtp", users.verifyOtp);

    app.get("/api/user/verify-email", users.verifyEmailLink);

    app.post("/api/user/edit", [authJwt.verifyToken], users.edit);

    app.post("/api/user/createNewPassword", [authJwt.verifyToken], users.createNewPassword);

    app.post("/api/user/updateProfile", [authJwt.verifyToken], users.updateProfile);
    
    app.post("/api/user/contactUs", [authJwt.verifyToken], users.contactUs);


};