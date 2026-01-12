const Joi= require('joi');
const reviews = require('./models/reviews');

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
    }).required()
})

module.exports.reviewSchema=Joi.object({
    reviews: Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(0).max(5),
    }).required()
})