const mongoose= require("mongoose");
const passportLocalMongoose= require("passport-local-mongoose").default;

const userSchema= new mongoose.Schema({

    email:{
        type:String,
        required: true
    }
});


//this generates salting and hashing on its own for the password and creates email schema on its own
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);