const express=require("express");
const router=express.Router();

const Listing= require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const expressError = require("../utils/expressError");
const {listingSchema,reviewSchema} = require("../schema.js");




  const validateListing=(req,res,next)=>{
     let { error }=  listingSchema.validate(req.body);
  if(error){
    throw new expressError(400,error)
  } else{
    next();
  }};


//INDEX ROUTEs
router.get("/",
    wrapAsync(  async (req,res)=>{
  let allListing =await Listing.find({});
  res.render("listings/index.ejs",{allListing});
}))

//new
router.get("/new",(req,res)=>{
   res.render("listings/new.ejs");
})


///post new  route
router.post("/",validateListing,
  wrapAsync( async (req,res)=>{
const newListing =new Listing(req.body.listing);
  await newListing.save(); 
req.flash("success","New listing created!");
   res.redirect("/listings");

  })
);

//Show route 
router.get("/:id",
  
    wrapAsync( async (req,res)=>{
  let {id} = req.params;
   const hotel=await  Listing.findById(id).populate("reviews");
   if(!hotel){
  req.flash("error","listing does not exist!");
return  res.redirect("/listings");
   }
   res.render("listings/show.ejs",{hotel});
}))


//EDIT route
router.get("/:id/edit", 
    wrapAsync( async (req,res)=>{
    let {id} = req.params;
   const list=await  Listing.findById(id);
   if(!list){
  req.flash("error","listing does not exist!");
return  res.redirect("/listings");
   }
   res.render("listings/edit.ejs",{list});
}))

//Update route
router.put("/:id",validateListing,
    wrapAsync(  async (req,res)=>{
let {id} = req.params;
await   Listing.findByIdAndUpdate(id, {...req.body.listing} );

  req.flash("success","listing Updated!"); 
res.redirect(`/listings/${id}`);
}))

//delete req
router.delete("/:id",
    wrapAsync(  async (req,res)=>{
  let {id}=req.params; 
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing Deleted!");
res.redirect("/listings");
}));

module.exports=router;