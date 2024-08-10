var md5 = require("md5");
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
const sendmail = require("../config/Sendmail.js");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const formidable = require('formidable');
const fs = require('fs');
const { tmpdir } = require('os');
const Constants = require("../config/Constants.js");
const ContactUs = db.contactUs


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
    var token = jwt.sign({ id: userData.id }, "test_upwork", {});
    userData.password = "";
    var data = {
      status: true,
      token: token,
      message: "SignUp successfully!",
      userData: userData,
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
  })
    .then(async (data) => {
      if (data.length != 0) {
        const userData = data[0];
        delete userData.dataValues.password;
        var token = jwt.sign({ id: data[0].id }, "test_upwork", {});
        var newObject = Object.assign(userData.dataValues);
        newObject.imageUrl = req.protocol + '://' + req.get('host') + '/' + userData.dataValues.profile_pic_hash + '.' + userData.dataValues.profile_pic_ext;
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
                "We received a request to login VaoXPod account. The verify Code is:" +
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

exports.getProfile = (req, res) => {
  User.findAll({
    where: {
      id: req.userId,
    },
  })
    .then(async (data) => {
      if (data.length != 0) {
        const userData = data[0];
        delete userData.dataValues.password;
        var token = jwt.sign({ id: data[0].id }, "test_upwork", {});
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

exports.edit = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "please enter required field!"
        });
    }
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password)
        };
        const userData = await User.update(user, { where: { id: req.userId } })
        var data = {
            status: true,
            userData: req.body
        }
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: error.message || "Something went wrong."
        });
    }
};

exports.createNewPassword = async (req, res) => {
    if (!req.body.newPassword || !req.body.confirmPassword) {
        return res.status(400).send({
            message: "please enter newPassword!"
        });
    }
    try {
        if (req.body.newPassword != req.body.confirmPassword) {
            return res.status(500).send({
                status: false,
                message: "password is  not match"
            });
        }
        const user = {
            password: md5(req.body.newPassword)
        };
        const userData = await User.update(user, { where: { id: req.userId } })
        var data = {
            status: true,
            data: 'Password is succeessfully updated.'
        }
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Something went wrong."
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({
            hashAlgorithm: 'sha1'
        });
        form.parse(req, async function (err, fields, files) {
            if (!!files.file) {
                var oldPath = files.file.filepath;
                var newPath = __dirname + '/../uploads' + '/' + files.file.hash + '.png';
                var rawData = fs.readFileSync(oldPath)
                fs.writeFile(newPath, rawData, async function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        const userUpdate = {
                            profile_pic_hash: files.file.hash,
                            profile_pic_ext: 'png',
                            name: fields.name
                        }
                        var updateData = await User.update(userUpdate, {
                            where: { id: req.userId }
                        });
                        var data = await User.findOne({
                            where: { id: req.userId }
                        });
                        const userData = data;
                        delete userData.dataValues.password;
                        var token = jwt.sign({ id: data.id }, 'test_upwork', {
                        });
                        var newObject = Object.assign(userData.dataValues);
                        newObject.imageUrl = req.protocol + '://' + req.get('host') + '/' + userData.dataValues.profile_pic_hash + '.' + userData.dataValues.profile_pic_ext;
                        var dataObject = {
                            status: true,
                            message: "Profile updated Successfully.",
                            token: token,
                            userData: newObject
                        }
                        res.send(dataObject);
                    }
                })
            } else {
                const userUpdate = {
                    name: fields.name
                }
                var updateData = await User.update(userUpdate, { where: { id: req.userId } });
                var data = await User.findOne({
                    where: { id: req.userId }
                });
                const userData = data;
                delete userData.dataValues.password;
                var token = jwt.sign({ id: data.id }, 'test_upwork', {
                });
                var newObject = Object.assign(userData.dataValues);
                newObject.imageUrl = req.protocol + '://' + req.get('host') + '/' + userData.dataValues.profile_pic_hash + '.' + userData.dataValues.profile_pic_ext;
                var dataObject = {
                    status: true,
                    message: "Profile updated Successfully.",
                    token: token,
                    userData: newObject
                }
                res.send(dataObject);
            }
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || "Something went wrong."
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
          subject: 'Contact Us Query',
          text: userStringString + contactString
      }
      sendmail.sendMail(sendMailData)
      const contactUsData = {
          query: req.body.queries,
          name: userDetails.name,
          user_email: userDetails.email
      };
      await ContactUs.create(contactUsData)
      var data = {
          status: true,
          data: 'Thank you for contacting us. We will reach out to you shortly.'
      }
      res.send(data)
  } catch (error) {
      console.log(error)
      res.status(500).send({
          status: false,
          message: "Something went wrong."
      });
  }
};
