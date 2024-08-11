var md5 = require("md5");
const db = require("../models");
const User = db.user;
const Profile = db.profile;
var jwt = require("jsonwebtoken");
const sendmail = require("../utils/Sendmail.js");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");

exports.create = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "please enter required field!",
    });
  }
  try {
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: md5(req.body.password),
      status: "pending",
      otp: md5(otp),
    };
    const userData = await User.create(user);
    const profilePayloadData = {
      userId: userData.id
    }
    const profileData = await Profile.create(profilePayloadData);
    const newObject = Object.assign(userData.dataValues);
    newObject.profile = profileData;
    const token = jwt.sign({ id: userData.id }, "test_upwork", {});
    userData.password = "";
    const data = {
      status: true,
      token: token,
      message: "SignUp successfully!",
      userData: newObject,
    };
    try {
      const sendMailData = {
        from: "hirensurani1997@gmail.com",
        to: req.body.email,
        subject: "Verify OTP",
        text:
          "We received a request to create account. The verify Code is:" + otp,
      };
      sendmail.sendMail(sendMailData);
    } catch (error) {
      console.log(error);
    }
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  var password = md5(req.body.password);
  User.findAll({
    where: {
      email: req.body.email,
      password: password,
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

        const otp = otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
        });
        const user = {
          otp: md5(otp),
        };
        const updateUserData = await User.update(user, {
          where: { id: data[0].id },
        });
        if (newObject.status == "pending") {
          try {
            const sendMailData = {
              from: "hirensurani1997@gmail.com",
              to: req.body.email,
              subject: "Verify OTP",
              text:
                "We received a request to login account. The verify Code is:" +
                otp,
            };
            sendmail.sendMail(sendMailData);
          } catch (error) {
            console.log(error);
          }
        }

        var dataObject = {
          status: true,
          message: "Login successfully!",
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

exports.verifyOtp = async (req, res) => {
  if (!req.body.otp || !req.body.email) {
    return res.status(400).send({
      message: "please enter your otp!",
    });
  }
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    try {
      if (!!userData) {
        const otp = userData.otp;
        if (otp != md5(req.body.otp)) {
          return res.status(500).send({
            status: false,
            message: "otp is wrong please  correct otp is enter ",
          });
        }
        var updateData = await User.update(
          { status: "active" },
          { where: { email: req.body.email } }
        );
        var token = jwt.sign({ id: userData.id }, "test_upwork", {});
        userData.status = "active";
        var data = {
          status: true,
          message: "otp is successfully verify",
          token: token,
          userData: userData,
        };
        res.send(data);
      } else {
        res.status(500).send({
          status: false,
          message: " please enter your correct email.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: false,
        message: error.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "please enter your correct email.",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  if (!req.body.email || !req.body.host) {
    return res.status(400).send({
      message: "please enter your email!",
    });
  }
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData || !userData.id) {
      return res.status(400).send({
        status: false,
        message: "please enter your correct email.",
      });
    }
    try {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const userupdate = await User.update(
        { verification_token: verificationToken },
        { where: { id: userData.id } }
      );

      const verificationUrl = `http://${req.body.host}/verify-email?token=${verificationToken}&email=${req.body.email}`;
      try {
        const sendMailData = {
          from: "hirensurani1997@gmail.com",
          to: userData.email,
          subject: "Forgot Password",
          html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
        };
        sendmail.sendMail(sendMailData);
      } catch (error) {
        console.log(error);
      }
      var data = {
        status: true,
        data: "Verification email is sent successfully ",
      };
      res.send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: false,
        message: error.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "please enter your correct email.",
    });
  }
};

exports.verifyEmailLink = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  try {
    const userData = await User.findOne({
      where: { email: email, verification_token: token },
    });
    if (!userData || !userData.id) {
      return res.status(400).send({
        status: false,
        message: "Invalid email or token.",
      });
    }
    try {
      var jwttoken = jwt.sign({ id: userData.id }, "test_upwork", {});
      var data = {
        status: true,
        token: jwttoken,
        data: "Email is verified. ",
      };
      res.send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: false,
        message: error.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "please enter your correct email.",
    });
  }
};

exports.createNewPassword = async (req, res) => {
  if (!req.body.newPassword || !req.body.confirmPassword) {
    return res.status(400).send({
      message: "please enter newPassword!",
    });
  }
  try {
    if (req.body.newPassword != req.body.confirmPassword) {
      return res.status(500).send({
        status: false,
        message: "password is  not match",
      });
    }
    const user = {
      password: md5(req.body.newPassword),
    };
    const userData = await User.update(user, { where: { id: req.userId } });
    var data = {
      status: true,
      data: "Password is succeessfully updated.",
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
