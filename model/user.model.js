const mongoose = require ("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'the name is required']
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date_created: {
        type: Date,
        required: true,
        default: new Date()
    },
    role:{
     type: String,
     enum:['User','Admin'],
     required:true,
     default :'User'
    }
})

const User = mongoose.model("User", userSchema);
module.exports.User = User;