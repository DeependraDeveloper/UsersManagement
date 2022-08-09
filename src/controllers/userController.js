const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userModel = require("../models/userModel");
const projectModel = require("../models/projectModel");

const {
  isValid,
  isValidObjectId,
  isValidlength,
  isValidrequestBody,
  isValidName,
  isValidComapanyName,
  isValidIndianNumber,
  isValidEmail,
} = require("../utils/validators");

// 01 -- creating a new user
const registerUser = async (req, res) => {
  try {
    if (!isValidrequestBody(req.body))
      return res
        .status(400)
        .json({ status: false, msg: "please provide user details" });

    let { Name, company_Name, ph_Number, email_Id, password } = req.body;

    if (!isValid(Name))
      return res
        .status(400)
        .json({ status: false, msg: "please provide name" });

    if (!isValidName(Name))
      return res.status(400).json({
        status: false,
        msg: "please provide valid name ! note-*-*-without any specail charsacter or numbers in bettwen",
      });

    if (!isValid(company_Name))
      return res
        .status(400)
        .json({ status: false, msg: "please provide comapnay name" });

    if (!isValidComapanyName(company_Name))
      return res.status(400).json({
        status: false,
        msg: "please provide valid company name ! note-*-*-can include number and string",
      });

    if (!isValid(ph_Number))
      return res
        .status(400)
        .json({ status: false, msg: "please provide phone number" });

    if (!isValidIndianNumber(ph_Number))
      return res.status(400).json({
        status: false,
        msg: "please provide valid contact number ! note-*-*-can include +91 or 10 digits",
      });

    let isConatactNumberUsed = await userModel.findOne({ ph_Number });
    if (isConatactNumberUsed)
      return res
        .status(400)
        .json({ status: false, msg: `${contactNumber} already exists` });

    if (!isValid(email_Id))
      return res
        .status(400)
        .json({ status: false, msg: "please provide emailid" });

    if (!isValidEmail(email_Id))
      return res
        .status(400)
        .json({ status: false, msg: "please provide valid email address" });

    let isEmailUsed = await userModel.findOne({ email_Id });
    if (isEmailUsed)
      return res
        .status(400)
        .json({ status: false, msg: `${email_Id} already exists` });

    if (!isValid(password))
      return res
        .status(400)
        .json({ status: false, msg: "please provide password" });

    if (password.length > 15 || password.length < 8)
      return res
        .status(400)
        .json({ status: false, msg: "password length should be between 8-15" });

    let hasedPassword = await bcrypt.hash(password, saltRounds);

    const newProfile = {
      Name,
      company_Name,
      ph_Number,
      email_Id,
      password: hasedPassword,
    };

    let createdProfile = await userModel.create(newProfile);

    res.status(201).send({
      status: true,
      message: "user regisgtered successfully",
      data: createdProfile,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

// 02 -- singup user

const login = async (req, res) => {
  try {
    if (!isValidrequestBody(req.body))
      return res.status(400).json({
        status: false,
        message: "Invalid parameters ,please provide email and password",
      });

    let { email_Id, password } = req.body;

    if (!isValid(email_Id))
      return res.status(400).json({
        status: false,
        message: "email is required",
      });

    if (!isValidEmail(email_Id))
      return res.status(400).json({
        status: false,
        message: `Email should be a valid email address`,
      });

    if (!isValid(password))
      return res
        .status(400)
        .json({ status: false, message: "password is required" });

    if (password.length < 8 || password.length > 15)
      return res
        .status(400)
        .json({ status: false, msg: "password length be btw 8-15" });

    if (email_Id && password) {
      let User = await userModel.findOne({ email_Id });
      if (!User)
        return res
          .status(400)
          .json({ status: false, msg: "email does not exist" });

      let decryppasss = await bcrypt.compare(password, User.password);

      if (decryppasss) {
        const Token = jwt.sign(
          {
            userId: User._id,
            exp: Math.floor(Date.now() / 1000) + 30 * 60,
          },
          "Dp2022"
        );

        res.status(200).json({
          status: true,
          msg: "successfully loggedin",
          data: { userId: User._id, token: Token },
        });
      } else
        return res.status(400).json({ status: false, Msg: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// 03 -- get prifile of authiorized users

const getProfile = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id) && !isValidlength(req.params.id))
      return res
        .status(400)
        .json({ status: false, msg: "please invalid objectid" });

    if (req.params.id.toString() !== req.user.userId)
      return res.status(401).json({
        status: false,
        message: `UnAuthorized access to user`,
      });

    let findProfile = await userModel.findById(req.params.id);
    if (!findProfile)
      return res.status(400).json({ status: false, msg: "profile not found" });

    return res
      .status(200)
      .json({ status: false, msg: "profile found", data: findProfile });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

// 04 -- update user profile

const updateUserProfile = async (req, res) => {
  try {
    let updateUserData = {};

    if (!isValidObjectId(req.params.id) && !isValidlength(req.params.id))
      return res
        .status(400)
        .json({ status: false, msg: "please invalid objectid" });

    if (req.params.id.toString() !== req.user.userId)
      return res.status(401).json({
        status: false,
        message: `UnAuthorized access to user`,
      });

    let findProfile = await userModel.findById(req.params.id);

    if (!findProfile)
      return res.status(400).json({ status: false, msg: "profile not found" });

    let { Name, company_Name, ph_Number, email_Id, password } = req.body;

    if (Name) {
      if (!isValidName(Name))
        return res.status(400).json({
          status: false,
          msg: "please provide valid name ! note-*-*-without any specail charsacter or numbers in bettwen",
        });
    }

    updateUserData["Name"] = Name;

    if (company_Name) {
      if (!isValidComapanyName(company_Name))
        return res.status(400).json({
          status: false,
          msg: "please provide valid company name ! note-*-*-can include number and string",
        });
    }

    updateUserData["company_Name"] = company_Name;

    if (ph_Number) {
      if (!isValidIndianNumber(ph_Number))
        return res.status(400).json({
          status: false,
          msg: "please provide valid contact number ! note-*-*-can include +91 or 10 digits",
        });

      let isConatactNumberUsed = await userModel.findOne({ ph_Number });

      if (isConatactNumberUsed)
        return res
          .status(400)
          .json({ status: false, msg: `${contactNumber} already exists` });
    }
    updateUserData["ph_Number"] = ph_Number;

    if (email_Id) {
      if (!isValidEmail) {
        return res.status(400).json({
          status: false,
          message: "Invalid request parameters. email required",
        });
      }
    }

    const duplicateEmail = await userModel.findOne({ email_Id });

    if (duplicateEmail)
      return res
        .status(400)
        .json({ status: false, message: "email already exists" });

    updateUserData["email_Id"] = email_Id;

    if (password) {
      if (isValid(password)) {
        const encryptPass = await bcrypt.hash(password, 10);
        updateUserData["password"] = encryptPass;
      }
    }

    const updatedProfile = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      updateUserData,
      { new: true }
    );

    return res.status(200).json({
      status: false,
      msg: "profile updated successfully",
      data: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

// 05 -- delete user profile
const deleteProfile = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id) && !isValidlength(req.params.id))
      return res
        .status(400)
        .json({ status: false, msg: "please invalid objectid" });

    if (req.params.id.toString() !== req.user.userId)
      return res.status(401).json({
        status: false,
        message: `UnAuthorized access to user`,
      });

    let findProfile = await userModel.findById(req.params.id);
    if (!findProfile)
      return res.status(400).json({ status: false, msg: "profile not found" });

    let deletedProfile = await profileModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: false,
      msg: "profile deleted successfully",
      data: deletedProfile,
    });
  } catch (err) {
    res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {
  registerUser,
  login,
  getProfile,
  updateUserProfile,
  deleteProfile,
};
