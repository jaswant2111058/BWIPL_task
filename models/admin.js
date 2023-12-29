const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type:String,
        unique:[true,"email already exist"],
        required: true
    },
    phone: {
        type:Number,
        unique:[true,"email already exist"],
        required: true
    },
    password:{
        type:String,
        required:true
    },
    profile_image:{
        type:String,
        required:true
    }
},
{
    timestamps: true
});
const Users = mongoose.model("bwipl_admin",Schema );

module.exports = Users