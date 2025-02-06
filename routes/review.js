const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const ExpressErrors = require("../utils/ExpressErrors.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js")
const {isLoggedIn,isAuthor} = require("../middlewares.js")
const {isOwner} = require("../middlewares.js")
const reviewController = require("../controllers/review.js")

//Reviews Validation 
const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
 
  if(error){
    throw new ExpressErrors(400, error)
  }else{
    next();
  }

}


router.post("/" , isLoggedIn,validateReview , wrapAsync(reviewController.createReview));


//delete rout reviews
router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router;