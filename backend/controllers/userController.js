const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    height: 155,
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);

  // Sending Email after rgister Successfully
  const message = `Dear ${name},

  Welcome to CellKart! We're thrilled to have you as a member of our mobile phone community.
  
  As a registered user, you now have access to a wide range of the latest smartphones and accessories. Enjoy a seamless shopping experience, exclusive deals, and top-notch customer support.
  
  Explore our collection at https://cellkart.onrender.com. If you have any questions, contact us at no.reply.cellkart@gmail.com or +1 (555) 555-1234.
  
  Happy shopping!
  
  Best regards,

  CellKart Team
  `;
  try {
    await sendEmail({
      email: user.email,
      subject: `Welcome to CellKart - Your Premier Mobile Phone Destination!`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
    sendToken(user, 201, res); //Login after password change.
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if user has given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);


  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const token = user.getJWTToken();

  sendToken(user, 200, res);
});

//Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //finding user in db
  const user = await User.findOne({ email: req.body.email });

  //if user not found
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  //saving the updated resetPasswordToken & resetPasswordExpire
  await user.save({ validateBeforeSave: false });

  //making the url to send
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is:- \n\n ${resetPasswordUrl} \n\n if you have not requested this email, please ignore it. \n Best regards, \n CellKart Team`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Password Recovery!🙂`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //Creating hash of the token from the email
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //Finding user from DB
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password"); //{resetPasswordToken:resetPasswordToken}

  //if user not found
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        400
      )
    );
  }

  //New Password & Confirm Password must be same
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  //Password cannot be same as previous password
  const isPasswordMatched = await user.comparePassword(
    req.body.confirmPassword
  );
  if (isPasswordMatched) {
    return next(
      new ErrorHandler("Password cannot be same as previous password", 400)
    );
  }

  //Changing the user Password
  user.password = req.body.password;

  //Password Token and Expiry should be undefined once the token is being used.
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //Saving user password
  await user.save();

  //Sending email after Password Change
  const message = `Your Password is Successfully Changed \n\n if it is not done by you, Please contact admin. \n Best regards, \n CellKart Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Password changed!😇`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
    sendToken(user, 200, res); //Login after password change.
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

//Get User details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Password
exports.updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar) {
    let user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      height: 155,
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Get All Users (for Admin)

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users: users,
  });
});

//Get single user (for admin)

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler("User doesn't exist with id: " + req.params.id, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Update User Role (for admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
  });
});

//Delete User (for admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  //remove cloudinary

  if (!user) {
    return next(
      new ErrorHandler("User doesn't exist with id: " + req.params.id, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
