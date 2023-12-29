const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    name: String,
    user_id:String,
    img:{
          data: Buffer,
          contentType: String
      }
  });
  module.exports =  mongoose.model("images", imageSchema);