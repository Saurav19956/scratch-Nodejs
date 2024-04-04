const mongoose = require('mongoose')
const {Schema}= mongoose;

const phoneSchema= new Schema({
    brand:{
        type:String,
        required :true},
    price:{
        type:Number,
        required:true},
    color:{
        type:String,
        required:true}
},{timestamps:true})



const mobile= mongoose.model('Mobile',phoneSchema)
module.exports = mobile;