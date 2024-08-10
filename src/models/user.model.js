const mongoose = require("mongoose");

const { Schema , model} = mongoose;

const UserSchema = new Schema({
 fullName:{
    type:String,
    required:true
 },
 email:{
    type:String,
    unique:true,
    required:true
 },
 password:{
    type:String,
    required:true,
 },
 confirmPassword:{
    type:String,
    required:true,
 },
 phoneNumber:{
    type:Number,
    required:true
 },
 profile: {
    type: String,
    default: "",
  },
  noOfContributions:{
  contributions:[]
  },
  activationToken: {
    type: String,
  },
  authCode: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
},
{
    timestamps: true,
    // include virtual properties in the JSON representation of the document.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

const userModel =  model("user",UserSchema);

module.exports = userModel;