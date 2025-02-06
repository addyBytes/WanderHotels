const express = require("express");
const router = express.Router({mergeParams:true});
const mongoose = require("mongoose");
const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const methodOverride = require("method-override");
const {listingSchema, reviewSchema} = require("../schema.js")
const ExpressErrors = require("../utils/ExpressErrors.js")
const Review = require("../models/review.js")
const {isLoggedIn} = require("../middlewares.js")
const {isOwner} = require("../middlewares.js")
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage })


const validateListing = (req,res,next) =>{
  console.log("Validating req.body:", req.body); 
  let {error} = listingSchema.validate(req.body);
 
  if(error){
    throw new ExpressErrors(400, error)
  }else{
    next();
  }

}

router.route("/")
.get(wrapAsync(listingController.index))
.post( isLoggedIn,upload.single('Listing[image]'),validateListing, wrapAsync(listingController.createListing));



router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id" )
.get( wrapAsync(listingController.showRoute))
.put(isLoggedIn,isOwner,upload.single('Listing[image]'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing))



router.get("/:id/edit" , isLoggedIn, isOwner,wrapAsync(listingController.editListing))



module.exports = router;