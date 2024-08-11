const { authJwt, verifySignUp } = require("../middleware");

module.exports = app => {
    const profile = require("../controllers/ProfileController.js");

    app.get("/api/profile/getProfile", [authJwt.verifyToken], profile.getProfile);

    app.post("/api/profile/updateProfile", [authJwt.verifyToken], profile.updateProfile);
    
    app.post("/api/profile/contactUs", [authJwt.verifyToken], profile.contactUs);

};