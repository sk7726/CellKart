const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//Authenticating the logged in user to show them different route.
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next)=>{
    const {token} = req.cookies;  //getting the token from cookie

    //if token is not available
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);


    req.user = await User.findById(decodedData.id);
    next();
    
});

//Authorizing the roles
exports.authorizedRoles = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next( new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
        }
}