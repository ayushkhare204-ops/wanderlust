const express=require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const reviews= require("./models/reviews.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const {listingSchema,reviewSchema} = require("./schema.js");


const methodOverride= require("method-override");

app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.set("view engine","ejs");
 app.set("views", path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))

main()
.then(()=>{
  console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }


  const validateListing=(req,res,next)=>{
     let { error }=  listingSchema.validate(req.body);
  if(error){
    throw new expressError(400,error)
  } else{
    next();
  }};

 const validatereview=(req,res,next)=>{
     let { error }=  reviewSchema.validate(req.body);
  if(error){
    throw new expressError(400,error)
  } else{
    next();
  }};


//home Route
app.get("/",async(req,res)=>{
  res.send("Hi I am root");
})

//INDEX ROUTEs
app.get("/listings",
    wrapAsync(  async (req,res)=>{
  let allListing =await Listing.find({});
  res.render("listings/index.ejs",{allListing});
}))

//new
app.get("/listings/new",(req,res)=>{
   res.render("listings/new.ejs");
})


///post new  route
app.post("/listings",validateListing,
  wrapAsync( async (req,res)=>{
const newListing =new Listing(req.body.listing);
  await newListing.save(); 

   res.redirect("/listings");

  })
);



//Show route 
app.get("/listings/:id",
  
    wrapAsync( async (req,res)=>{
  let {id} = req.params;
   const hotel=await  Listing.findById(id).populate("reviews");
   res.render("listings/show.ejs",{hotel});
}))



//update
app.get("/listings/:id/edit", 
    wrapAsync( async (req,res)=>{
    let {id} = req.params;
   const list=await  Listing.findById(id);
   res.render("listings/edit.ejs",{list});
}))

//put req
app.put("/listings/:id",validateListing,
    wrapAsync(  async (req,res)=>{
let {id} = req.params;
await   Listing.findByIdAndUpdate(id, {...req.body.listing} );
 res.redirect(`/listings/${id}`);
}))

//delete req
app.delete("/listings/:id",
    wrapAsync(  async (req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
res.redirect("/listings");
}));


//reviews post
app.post("/listings/:id/reviews",validatereview,
  wrapAsync( async (req,res)=>{
      const listing= await Listing.findById(req.params.id);
  const newreview=new reviews (req.body.review);
  listing.reviews.push(newreview);   
  await newreview.save();
  await listing.save();
  res.redirect(`/listings/${req.params.id}`);
  }));



//delete review
app.delete("/listings/:id/reviews/:reviewid",
  wrapAsync( async (req,res)=>{
    
    let {id,reviewid}=req.params;

      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
      await reviews.findByIdAndDelete(reviewid);
      res.redirect(`/listings/${req.params.id}`);
}));


// app.get("/testListing", async(req,res)=>{
//   let sampleListing =new Listing({
//     title:"my new villa",
//     description:"by the Beach",
//     price:1200,
//     location:"calangute, goa",
//     country:"India"
//   });
//   await sampleListing.save();
//   console.log("saved in db")
//   res.send("success")
// })


app.all(/.*/, (req, res, next) => {
  next(new expressError(404, "Page Not Found!!!"));
});



///Middlewear for custom error handling
app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.render("listings/error.ejs",{message})
});



app.listen(8080,(req,res)=>{
    console.log("app is listening");
}) 