const express=require("express");
const app= express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js");
const User= require("./models/user.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const expressError = require("./utils/expressError");
const session =require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");

const methodOverride= require("method-override");

app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate);
 app.set("view engine","ejs");
 app.set("views", path.join(__dirname,"views"));
 app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")))

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


main()
.then(()=>{
  console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }


const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:(Date.now()+ 7*24*60*60*1000),
    maxAge:7*24*60*60*1000,
  httpOnly:true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});


//home Route
app.get("/",async(req,res)=>{
  res.send("Hi I am root");
})



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)



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