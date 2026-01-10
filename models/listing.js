
const mongoose= require("mongoose");

const listingSchema= new mongoose.Schema({
    title:{type:String,
        required:true},
    description:String,
    image:{
        fileneame: 
            {type:"String",
            default:"Listingimg",
        },
        url:
            {type:String,
            default: "https://png.pngtree.com/background/20230425/original/pngtree-two-beds-are-in-a-hotel-room-picture-image_2471633.jpg",
            set: (v)=> v==="" ? "https://png.pngtree.com/background/20230425/original/pngtree-two-beds-are-in-a-hotel-room-picture-image_2471633.jpg"
            :v,
    }},
    price:Number,
    location:String,
    country:String,
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;