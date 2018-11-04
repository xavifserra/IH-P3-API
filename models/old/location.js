const mongoose = require('mongoose')

const { Schema } = mongoose

// const Place = require('./place')
const Comment = require('../comment')

const locationSchema = new Schema({
  id: Number,
  name: String,
  address: String,
  category: String,
  location: String,
  lat: Number,
  lng: Number,
  numReviews: Number,
  polarity: Number,
  reviews: String,
  details: String,
  rev: String,
  det: String,
})

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
