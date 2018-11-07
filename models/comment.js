const mongoose = require('mongoose')

const { Schema } = mongoose

const  { ObjectId }  = mongoose.SchemaTypes

const commentSchema = new Schema(
  {
    postedBy: { type: ObjectId, ref: 'User' },
    //placeId: { type: ObjectId, ref: 'Place' },
    details: String,
    language: { type:String, default:'en' },
    rating: { type:Number, min:0, max:5 },
    timeStamp: { type:Date, default: Date.now },
    airConditioned: Boolean,
    clean: { type:Number, min:0, max:5 },
    smells: { type:Number, min:0, max:5 },
    quiet: { type:Number, min:0, max:5 },
    suplements: Boolean,
    bright: { type:Number, min:0, max:5 },
    wifi: { type:Number, min:0, max:5 },
    movileCoverage: { type:Number, min:0, max:5 },
  },
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
