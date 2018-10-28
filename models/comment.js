const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const  { ObjectId }  = mongoose.SchemaTypes

const commentSchema = new Schema(
  {
    id: Number,
    text: String,
    language: String,
    rating: Number,
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
    movileCoberage: Boolean,
    postedBy: { type: ObjectId, ref: 'User' },
    placeId: { type: ObjectId, ref: 'Place' },
    details: String,
  },
)

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
