const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId, Decimal128: Double } = mongoose.SchemaTypes

const placeSchema = new Schema({
  id: { type: Number, unique: true },
  name: String,
  address: String,
  category: String,
  location: String,
  numReviews: Number,
  polarity: Number,
  reviews: String,
  details: String,
  lat: Number,
  lng: Number,
  // geo: {
  //   type: { type: String, index: true },
  //   coordinates: { type: [Number], index: '2dsphere' },
  // },
  geoLocation: {
    type: { type: String },
    coordinates: [Number],
  },
})

placeSchema.index({ geoLocation: '2dsphere' })

// placeSchema.pre('save',  (next) => {
//   const value = this.get('geoLocation')

//   if (value === null) return next()
//   if (value === undefined) return next()
//   if (!Array.isArray(value)) return next(new Error('Coordinates must be an array'))
//   if (value.length === 0) return this.set(path, undefined)
//   if (value.length !== 2) return next(new Error('Coordinates should be of length 2'))

//   next()
// })

const Place = mongoose.model('Place', placeSchema)

module.exports = Place
