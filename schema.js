const Joi = require("joi");
const listingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
    }),
    image: Joi.string().allow("",null),
    price: Joi.number().greater(0).required().messages({
      "number.base": "Price must be a number",
      "number.greater": "Price must be greater than 0",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required",
    }),
  }).required(),
});

module.exports ={listingSchema};

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating : Joi.number().required().min(0).max(5), 
    comment: Joi.string().required(),
     }).required()
});