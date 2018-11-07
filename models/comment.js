const mongoose = require('mongoose')

const { Schema } = mongoose

const  { ObjectId }  = mongoose.SchemaTypes

const commentSchema = new Schema(
  {
    postedBy: { type: ObjectId, ref: 'User' },
    //placeId: { type: ObjectId, ref: 'Place' },
    details: String,
    language: { type:String, default:'en' },
    rating: { type:Number, min:0, max:5, default:0 },
    timeStamp: { type:Date, default: Date.now },
    // airConditioned: Boolean,
    // suplements: Boolean,
    clean: { type:Number, min:0, max:5, default:0 },
    smells: { type:Number, min:0, max:5, default:0 },
    quiet: { type:Number, min:0, max:5, default:0 },
    bright: { type:Number, min:0, max:5, default:0 },
    wifi: { type:Number, min:0, max:5, default:0 },
    movileCoverage: { type:Number, min:0, max:5, default:0 },
  },
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
