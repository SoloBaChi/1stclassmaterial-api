
const mongoose = require("mongoose");

const { Schema , model} = mongoose;

const ContributorSchema = new Schema({
 courseTitle:{
    type:String
 },
 courseType:{
   type:String
 },
 courseCode:{
    type:String
 },
 department:{
    type:String,
 },
 level:{
   type:Number,
 },
 docURL:{
    type:String,
    default:""
 },
 contributor:{
   type:mongoose.SchemaTypes.ObjectId
 }
},
{
    timestamps: true,
    // include virtual properties in the JSON representation of the document.
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)

const contributorModel =  model("contributor",ContributorSchema);

module.exports = contributorModel;