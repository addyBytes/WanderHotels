const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js")
const userController = require("../controllers/users.js")

router.get("/signup" , userController.renderSignup)

router.post("/signup", wrapAsync(userController.signup)) 

router.get("/login" , userController.renderLogin)

router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect :"/login", failureFlash:true}), wrapAsync(userController.login)) 

router.get("/logout", userController.logout)

module.exports = router;