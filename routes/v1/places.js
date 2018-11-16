const express = require('express')

const router = express.Router()
const Places = require('../../models/place')
const { isLoggedIn } = require('../../helpers/is-logged')
const { getDistanceBetweenTwoPointsInKm } = require('../../helpers/distances')

// TODO: proteger  isLoggedIn()

// return all places or optional find params.
router.get('/', isLoggedIn(), (req, res, next) => {
  const { offset, qtty } = req.query
  console.log(offset, qtty)

  Places.find({ }, (err, response) => {
    if (err) return res.status(404).json({ error:err })
    return res.status(200).json({ documentos: response.length, data: response })
  })
})

// TODO: proteger  isLoggedIn() y isOwner?
// CRUD Read
router.get('/:id([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { id } = req.params

  Places.findById(id, (err, response) => {
    const documents = response ? response.length : 0

    if (err) return res.status(404).json({ error:err })

    return res.status(200).json({ documents, data: response })
  }).populate('comments')
})

// CRUD Create  isLoggedIn(),
router.post('/', (req, res, next) => {
  const {
    name,
    address,
    lat,
    lng,
    services,
  } = req.body

  Places.create(
    {
      services,
      owner:req.session.currentUser._id,
      name,
      address,
      category:'Restaurant',
      location:'Barcelona',
      lat,
      lng,
      geoLocation:{
        type : 'Point',
        coordinates : [lng, lat],
      },
    } // ,(error, success )=>{console.log('error',error), console.log('success',success);}
  ).then((element) => {
    console.log('-------->', element)
    res.status(200).json(element)
  }).catch((error) => {
    res.status(500).json({ error })
  })
})

// CRUD Update
router.put('/:id([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { id } = req.params
  const {
    _id,
    name,
    address,
    lat,
    lng,
    services,
  } = req.body
  console.log('peticion', req.body)

  Places.findById(id)
    .then((element) => {
      console.log(element)
      if (element) {
        element.name = name
        element.address = address
        element.category = 'Restaurant'
        element.location = 'Barcelona'
        element.lat = lat
        element.lng = lng
        element.owner = req.session.currentUser._id
        geoLocation = {
          type : 'Point',
          coordinates : [lng, lat],
        }
        element.services = services
        return element.save()
      }
    })// .populate('comments')
    .then((updatedElement) => {
      console.log({ updatedElement })
      res.status(200).json(updatedElement)
    })
    .catch((error) => {
      res.status(500).json({ error })
    })
})

// CRUD Delete
router.delete('/:id([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { id:_id } = req.params
  Places.deleteOne({ _id })
    .then((element) => {
      res.status(200).json(element)
    })
    .catch((error) => {
      res.status(404).json({ message:error })
    })
})

router.get('/around', isLoggedIn(), (req, res, next) => {
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
// not protected
router.get('/aroundGeoJSON', (req, res, next) => {
  const { lat, lng, dist, limit } = req.query
  // console.log(req.query)
  const centerPoint = { type: 'Point', coordinates:[lng, lat]  }
  // console.log(centerPoint)
  // Places.near({center: {coordinates: [latitude, longitude], type: 'Point'}, maxDistance: maxDistance})

  Places.find({ geoLocation:{ $near:{ $geometry: centerPoint, $maxDistance:dist } } })// , { geoLocation:1 })
    // .populate('comments')
    // .populate('owner')
    .limit(limit)
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
            name: element.name,
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
            services : element.services,
            owner: element.owner,
            comments: element.comments,
          },
          geometry: element.geoLocation,
        })
      })
      console.log({ items:responseGeoJSON.features.length })
      return res.status(200).json(responseGeoJSON)
    })
})

module.exports = router
