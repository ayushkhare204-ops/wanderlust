const express=require("express");
const router =express.Router({ mergeParams: true});

const reviews= require("../models/reviews.js");
const Listing= require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {reviewSchema} = require("../schema.js");




 const validatereview=(req,res,next)=>{
     let { error }=  reviewSchema.validate(req.body);
  if(error){
    throw new expressError(400,error)
  } else{
    next();
  }};



//reviews post
router.post("/",validatereview,
  wrapAsync( async (req,res)=>{
      const listing= await Listing.findById(req.params.id);
  const newreview=new reviews (req.body.review);
  listing.reviews.push(newreview);   
  await newreview.save();
  await listing.save();
  
  req.flash("success","New Review Added!");
  res.redirect(`/listings/${req.params.id}`);
  }));



//delete review
router.delete("/:reviewid",
  wrapAsync( async (req,res)=>{
    
    let {id,reviewid}=req.params;

      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
      await reviews.findByIdAndDelete(reviewid);
      
  req.flash("success","Review deleted!");
      res.redirect(`/listings/${req.params.id}`);
}));
module.exports=router;