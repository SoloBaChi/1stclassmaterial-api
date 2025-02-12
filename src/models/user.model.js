const mongoose = require("mongoose");
// const resultsModel = require("./result.model")

const { Schema, model } = mongoose;



const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      trim:true
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      trim:true
    },
    confirmPassword: {
      type: String,
      trim:true
    },
    phoneNumber: {
      type: Number,
      trim:true,
    },
    department: {
      type: String,
      trim:true,
    },
    level: {
      type:Number,
      default:100,
    },
    profileImg: {
      type: String,
      default: "",
    },
    noOfContributions: {
      type: Number,
      default: 0,
    },
    joinedDate:{
    type:Date,
    default:Date.now()
     },
    checkedResults:{
      type:Number,
      default:0
    },
    cgpaPoints:{
      type:Number,
      default:5
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
    isAdmin:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
    // include virtual properties in the JSON representation of the document.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const userModel = model("User", UserSchema);

module.exports = userModel;
