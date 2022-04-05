const passport = require("passport");
const CustomStrategy = require("passport-custom").Strategy;
const usersModel = require("../services/users/users.model");
const registerModel = require("../services/registers/registers.model");

const commonFunctions = require("./functions");
// Passport Custom Strategy
passport.use(
  "user",
  new CustomStrategy(async function (req, done) {
    try {
      req.body.email = req.body.email.toLowerCase();
      let user = await usersModel.findOne({ email: req.body.email });
      console.log("User Data : ", user);
      if (!user) {
        return done(new Error("INVALID_EMAIL"));
      }
      let isPasswordValid = await commonFunctions.matchPassword( req.body.password, user.password );
      console.log("isPasswordValid : ",isPasswordValid);
      if(isPasswordValid){
        let register = await registerModel.findOne({ user_id: user._id,is_main:true});
        
        user.register_id  = register ? register._id : "";
        user.register_name  = register ? register.register_name : "";
       
        return done(null, user); 
      }else{
        return done(new Error("INVALID_PASSWORD"));
      }
    } catch (error) {
      return done(error);
    }
  })
);
