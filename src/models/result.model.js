const mongoose = require("mongoose");

const { Schema, model } = mongoose;


const ResultSchema = new Schema({
 courseCode:{
  type:String,
  default:""
 },
 courseTitle:{
  type:String,
  default:""
 },
 unitLoad:{
  type:String,
  default:""
 },
 grade:{
  type:String,
  default:""
 },
 gradePoint:{
  type:Number,
  default:5,
 },
 semester:{
  type:String,
  default:""
 },
 createdBy:{
  type:mongoose.SchemaTypes.ObjectId
 }
},
{
  timestamps: true,
    // include virtual properties in the JSON representation of the document.
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  },
);


const resultsModel = model("Result", ResultSchema);
module.exports = resultsModel;
