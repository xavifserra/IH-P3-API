const mongoose = require('mongoose')
const axios = require('axios')
const Place = require('../models/place')

mongoose.connect('mongodb://localhost:27017/ironhack-project3', {
  useNewUrlParser: true,
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to database'))

const getDetails = query => axios.get(query)

db.collection('places').drop()

axios.get('http://tour-pedia.org/api/getPlaces?location=Barcelona&category=restaurant')
  .then(async ({ data }) => {

    data.forEach((element) => {
      const { details, lng, lat } = element
      element.geoLocation = {
        type: 'Point',
        coordinates: [lng, lat],
      }
      console.log(details, lng, lat, element.geoLocation)

      Place.create(element).then(resp => console.log(`local ${resp.id} saved in ${resp._id}`)).catch(e => console.log(e))
      // getDetails(details)
      //   .then((place) => {
      //     const { data: dataPlace } = place
      //     console.log(`local ${dataPlace.id} ok`)
      //     element.details = dataPlace
      //     Place.create(element).then(resp => console.log(`local ${resp.id} saved in ${resp._id}`))
      //   })
    })
    return await Place.find()
  }).then( (elements) => { console.log(elements); db.close() })
  .catch(e => console.log(`error: ${e}`))
