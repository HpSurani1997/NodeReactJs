var md5 = require("md5");
const db = require("../models");
const User = db.user;
const Profile = db.profile;
var jwt = require("jsonwebtoken");
const sendmail = require("../utils/Sendmail.js");
const formidable = require("formidable");
const fs = require("fs");
const Constants = require("../config/Constants.js");
const ContactUs = db.contactUs;

exports.getProfile = (req, res) => {
  User.findAll({
    where: {
      id: req.userId,
    },
    include: [
      {
        model: Profile,
        as: "profile",
        rejectOnEmpty: true,
        required: false,
      },
    ],
  })
    .then(async (data) => {
      if (data.length != 0) {
        const userData = data[0];
        delete userData.dataValues.password;
        var token = jwt.sign({ id: data[0].id }, "test_upwork", {});
        var newObject = Object.assign(userData.dataValues);
        if (newObject.profile?.profile_pic_hash) {
          newObject.imageUrl =
            req.protocol +
            "://" +
            req.get("host") +
            "/" +
            userData.dataValues.profile.profile_pic_hash +
            "." +
            userData.dataValues.profile.profile_pic_ext;
        } else {
          newObject.imageUrl = "";
        }
        var dataObject = {
          status: true,
          message: "Profile get successfully!",
          token: token,
          userData: newObject,
        };
        res.send(dataObject);
      } else {
        res.status(400).send({
          status: false,
          message: "Email or Password not Match!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        status: false,
        message: err.message || "Something went wrong.",
      });
    });
};

exports.updateProfile = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({
      hashAlgorithm: "sha1",
    });
    form.parse(req, async function (err, fields, files) {
      if (!!files.file) {
        var oldPath = files.file.filepath;
        var newPath =
          __dirname + "/../uploads" + "/" + files.file.hash + ".png";
        var rawData = fs.readFileSync(oldPath);
        fs.writeFile(newPath, rawData, async function (err) {
          if (err) {
            console.log(err);
          } else {
            const userUpdate = {
              name: fields.name,
            };
            const profileUpdate = {
              profile_pic_hash: files.file.hash,
              profile_pic_ext: "png",
            };
            const updateData = await User.update(userUpdate, {
              where: { id: req.userId },
            });
            const updateProfileData = await Profile.update(profileUpdate, {
              where: { userId: req.userId },
            });
            var data = await User.findOne({
              where: { id: req.userId },
              include: [
                {
                  model: Profile,
                  as: "profile",
                  rejectOnEmpty: true,
                  required: false,
                },
              ],
            });
            const userData = data;
            delete userData.dataValues.password;
            var token = jwt.sign({ id: data.id }, "test_upwork", {});
            var newObject = Object.assign(userData.dataValues);
            if (newObject.profile?.profile_pic_hash) {
              newObject.imageUrl =
                req.protocol +
                "://" +
                req.get("host") +
                "/" +
                userData.dataValues.profile.profile_pic_hash +
                "." +
                userData.dataValues.profile.profile_pic_ext;
            } else {
              newObject.imageUrl = "";
            }
            var dataObject = {
              status: true,
              message: "Profile updated Successfully.",
              token: token,
              userData: newObject,
            };
            res.send(dataObject);
          }
        });
      } else {
        const userUpdate = {
          name: fields.name,
        };
        var updateData = await User.update(userUpdate, {
          where: { id: req.userId },
        });
        var data = await User.findOne({
          where: { id: req.userId },
          include: [
            {
              model: Profile,
              as: "profile",
              rejectOnEmpty: true,
              required: false,
            },
          ],
        });
        const userData = data;
        delete userData.dataValues.password;
        var token = jwt.sign({ id: data.id }, "test_upwork", {});
        var newObject = Object.assign(userData.dataValues);
        if (newObject.profile) {
          newObject.imageUrl =
            req.protocol +
            "://" +
            req.get("host") +
            "/" +
            userData.dataValues.profile.profile_pic_hash +
            "." +
            userData.dataValues.profile.profile_pic_ext;
        } else {
          newObject.imageUrl = "";
        }
        var dataObject = {
          status: true,
          message: "Profile updated Successfully.",
          token: token,
          userData: newObject,
        };
        res.send(dataObject);
      }
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.contactUs = async (req, res) => {
  try {
    var userDetails = await User.findOne({ where: { id: req.userId } });
    var userStringString = `User Details\nName: ${req.body.name}\nEmail: ${req.body.email}\n\n`;
    var contactString = `Query Details\nQuery: ${req.body.queries}n\n`;
    const sendMailData = {
      from: userDetails.email,
      to: Constants.contactEmail,
      subject: "Contact Us Query",
      text: userStringString + contactString,
    };
    sendmail.sendMail(sendMailData);
    const contactUsData = {
      query: req.body.queries,
      name: userDetails.name,
      user_email: userDetails.email,
    };
    await ContactUs.create(contactUsData);
    var data = {
      status: true,
      data: "Thank you for contacting us. We will reach out to you shortly.",
    };
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Something went wrong.",
    });
  }
};
