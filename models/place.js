const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const { ObjectId, Decimal128: Double } = mongoose.SchemaTypes;

const placeSchema = new Schema({
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
  services: {
    en: [String],
    it: [String],
    fr: [String],
    nl: [String],
    de: [String],
    es: [String],
  },
  phone_number: String,
  international_phone_number: String,
  website: String,
  icon: String,
  description: {
    en: String,
    it: String,
    fr: String,
    nl: String,
    de: String,
    es: String,
    unidentified: String,
  },
  external_urls: {
    Foursquare: String,
    Facebook: String,
    GooglePlaces: String,
    Booking: String,
  },
  statistics: {
    Foursquare: {
      checkinsCount: Number,
      usersCount: Number,
      tipCount: Number,
      price: Number,
      likes: Number,
      hereNow: {
        count: Number,
        summary: Number,
        groups: [Number],
      },
    },
    Facebook: {
      checkins: Number,
      talking_about_count: Number,
      were_here_count: Number,
      fan_count: Number,
    },
  },
  numReviews: Number,
  reviews: [String],
  polarity: Number,
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
