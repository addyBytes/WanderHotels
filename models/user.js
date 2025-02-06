const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passporLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema ({
  email : {
    type : String,
    required : true,
  },

})

userSchema.plugin(passporLocalMongoose);

module.exports =  mongoose.model("User", userSchema);