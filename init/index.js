const mongoose= require("mongoose");
const Listing= require("../models/listing.js");
const initdata= require("./data.js");

main()
.then(()=>{
  console.log("Connected to DB");
  
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
  }

  const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialised");
  }

  initDB();