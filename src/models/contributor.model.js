
const mongoose = require("mongoose");

const { Schema , model} = mongoose;

const ContributorSchema = new Schema({
 courseTitle:{
    type:String,
    required:true
 },
 courseCode:{
    type:String,
    required:true,
 },
 department:{
    type:String,
    required:true,
 },
 level:String,
 docURL:{
    type:String,
    required:true,
    default:""
 },
 uploadedBy:{
   type:mongoose.SchemaTypes.ObjectId,
   // ref:"user"
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