const mongoose = require('mongoose')

const { Schema } = mongoose

const { ObjectId } = mongoose.SchemaTypes

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
  geoLocation: {
    type: { type: String },
    coordinates: [Number],
  },
  comments: [{ type: ObjectId, ref: 'Comment' }],
  owner: { type: ObjectId, ref: 'User' },
  services: {
    airConditioned: Boolean,
    fidelityCard: Boolean,
    ticketRestaurant: Boolean,
    chequeGourmet: Boolean,
    wifi: Boolean,
    movileCoverage: Boolean,
    pets: Boolean,
    adapted: Boolean,
  },
})

placeSchema.index({ geoLocation: '2dsphere' })

// placeSchema.pre('save',  (next) => {
//   const valueGeoLocation = this.get('geoLocation')
//   const valueLat = this.get('lat')
//   const valueLng = this.get('lng')

//   console.log({ valueLat, valueLng })

//   if (!valueLat || !valueLng) return next()
//   if (valueGeoLocation === null || valueGeoLocation === undefined) {
//     valueGeoLocation.type = 'Point'
//     valueGeoLocation.coordinates = [valueLat, valueLng]
//     console.log({ valueGeoLocation })
//     return next()
//   }
//   if (valueGeoLocation === undefined) return next()
//   if (!Array.isArray(valueGeoLocation)) return next(new Error('Coordinates must be an array'))
//   // if (valueGeoLocation.length === 0) return this.set(path, undefined)
//   if (valueGeoLocation.length !== 2) return next(new Error('Coordinates should be of length 2'))

//   next()
// })

const Place = mongoose.model('Place', placeSchema)

module.exports = Place
