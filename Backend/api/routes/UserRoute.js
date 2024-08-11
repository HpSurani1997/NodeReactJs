const { authJwt, verifySignUp } = require("../middleware");

module.exports = app => {
    const users = require("../controllers/UserController.js");

    app.post("/api/user/register", [verifySignUp.checkDuplicateUsernameOrEmail], users.create);

    app.post("/api/user/login", users.login);

    app.post("/api/user/forgotPassword", users.forgotPassword);

    app.post("/api/user/verifyOtp", users.verifyOtp);

    app.get("/api/user/verify-email", users.verifyEmailLink);

    app.post("/api/user/createNewPassword", [authJwt.verifyToken], users.createNewPassword);

};