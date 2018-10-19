const mongoose = require('mongoose')
const axios = require('axios')
const Location = require('../models/location')
const  Place  = require('../models/place')

mongoose.connect('mongodb://localhost:27017/ironhack-project3', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => console.log('Connected to database'))

const getDetails = query => axios.get(query)

axios.get('http://tour-pedia.org/api/getPlaces?location=Barcelona&category=restaurant')
  .then((object) => {
    const { data } = object

    Location.create(data).then(msg => console.log(msg)).catch(e => console.log(e))
  })

axios.get('http://tour-pedia.org/api/getPlaces?location=Barcelona&category=restaurant')
  .then((object) => {
    const { data } = object

    Location.create(data).then(msg => console.log(msg)).catch(e => console.log(e))

    data.forEach((element) => {
      const { details } = element

      return getDetails(details)
        .then((place) => {
          const { data: dataPlace } = place
          console.log(`local ${dataPlace.id} ok`)
          element.details = dataPlace
          Place.create(element).then(resp => console.log(`local ${resp.id} saved in ${resp._id}`))
        })
    })
  })
  .catch(e => console.log(`error: ${e}`))
