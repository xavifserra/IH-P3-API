const express = require('express')

const router = express.Router()
const Places = require('../../models/place')
const { isLoggedIn } = require('../../helpers/is-logged')
const {getDistanceBetweenTwoPointsInKm} = require('../../helpers/distances')

// TODO: proteger  isLoggedIn()

// return all places or optional find params.
router.get('/', (req, res, next) => {
  const { offset, qtty } = req.query
  console.log(offset, qtty)

  Places.find({ }, (err, response) => {
    if (err) return res.status(404).json({ error:err })
    return res.status(200).json({ documentos: response.length, data: response })
  })
})

// TODO: proteger  isLoggedIn() y isOwner?
// CRUD Read
router.get('/:id([0-9]+)', (req, res, next) => {
  const { id } = req.params

  Places.findById(id, (err, response) => {
    if (err) return res.status(404).json({ error:err })
    return res.status(200).json({ documents: response.length, data: response })
  })
})
// CRUD Create
router.post('/', isLoggedIn(), (req, res, next) => {
  res.status(200).json(req.body)
})

// CRUD Update
router.put('/', isLoggedIn(), (req, res, next) => {
  const { id } = req.params
  res.status(200).json({ id, body: req.body })
})

// CRUD Delete
router.delete('/', isLoggedIn(), (req, res, next) => {
  const { id } = req.params
  res.status(200).json({ id, body: req.body })
})

// isLoggedIn(),
router.get('/around',  (req, res, next) => {
  const { lat, lng, dist } = req.query
  console.log(req.query)
  const centerPoint = { type: 'Point', coordinates:[lng, lat]  }
  console.log(centerPoint)
  // Places.near({center: {coordinates: [latitude, longitude], type: 'Point'}, maxDistance: maxDistance})

  Places.find({ geoLocation:{ $near:{ $geometry: centerPoint, $maxDistance:dist } } })
    .find((error, response) => (error
      ? res.status(500).json({ message:error })
      : res.status(200).json({ documents: response.length, data: response })))
})

// isLoggedIn(),
router.get('/aroundGeoJSON',  (req, res, next) => {
  const { lat, lng, dist } = req.query
  console.log(req.query)
  const centerPoint = { type: 'Point', coordinates:[lng, lat]  }
  console.log(centerPoint)
  // Places.near({center: {coordinates: [latitude, longitude], type: 'Point'}, maxDistance: maxDistance})

  Places.find({ geoLocation:{ $near:{ $geometry: centerPoint, $maxDistance:dist } } })// , { geoLocation:1 })
    .find((error, response) => {
      const responseGeoJSON = {
        type:'FeatureCollection',
        features:[],
      }

      if (error) return res.status(500).json({ message:error })

      response.forEach((element) => {
        responseGeoJSON.features.push({
          type:'Marker',
          properties:{
            _id: element._id,
            id: element.id,
            place: element.name,
            address: element.address,
            category: element.category,
            location: element.location,
            numReviews: element.numReviews,
            reviews: element.reviews,
            details: element.details,
            polarity: `${element.polarity}`,
            lat: `${element.lat}`,
            lng: `${element.lng}`,
            distance:getDistanceBetweenTwoPointsInKm(lat, lng, element.lat, element.lng),
          },
          geometry: element.geoLocation,
        })
      })
      console.log({ items:responseGeoJSON.features.length })
      return res.status(200).json(responseGeoJSON)
    })
})

module.exports = router
