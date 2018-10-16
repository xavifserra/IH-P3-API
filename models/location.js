const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const { ObjectId, Decimal128: Double } = mongoose.SchemaTypes;


const Place = require('./place');
const Comment = require('./comment');

const locationSchema = new Schema({
  id: Number,
  name: String,
  address: String,
  category: String,
  location: String,
  lat: Double,
  lng: Double,
  coordinates: {
    type: 'Point',
    coordinates: [{
      longitude: Double,
      latitude: Double,
    }],
  },
  numReviews: Number,
  polarity: Number,
  reviews: String,
  details: String,
  rev: String,
  det: String,
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
