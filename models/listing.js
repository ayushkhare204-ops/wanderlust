
const mongoose= require("mongoose");
const reviews= require("./reviews.js");

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
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review",
    }],
})

listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
    await reviews.deleteMany({_id:{$in:listing.reviews}});
}})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;