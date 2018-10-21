const mongoose = require('mongoose')
const axios = require('axios')
const Location = require('../models/location')
const Place = require('../models/place')

mongoose.connect('mongodb://localhost:27017/ironhack-project3', {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to database'))

const getDetails = query => axios.get(query)

db.collection('location').drop()

axios.get('http://tour-pedia.org/api/getPlaces?location=Barcelona&category=restaurant')
  .then(async ({ data }) => {
    const places = await Location.create(data);
    return places;
  })
  .then(() => db.close())
  .catch(e => console.log(`error: ${e}`))
