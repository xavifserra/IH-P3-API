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
    time: { type:Date, default: Date.now },
    airConditioned: Boolean,
    clean: Boolean,
    smells: Boolean,
    quiet: Boolean,
    suplements: Boolean,
    fidelityCard: Boolean,
    ticketRestaurant: Boolean,
    chequeGourmet: Boolean,
    bright: Boolean,
    wifi: Boolean,
    movileCoverage: Boolean,
  },
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
