const express = require('express')

const router = express.Router()
const Places = require('../../models/place')
const { isLoggedIn } = require('../../helpers/is-logged')

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

// TODO proteger  isLoggedIn() y isOwner?
router.get('/:id([0-9]+)', (req, res, next) => {
  const { id } = req.params

  Places.findById(id, (err, response) => {
    if (err) return res.status(404).json({ error:err })
    return res.status(200).json({ documents: response.length, data: response })
  })
})

router.post('/', isLoggedIn(), (req, res, next) => {
  console.log('POST api/v1/places')
  const { id } = req.body
  if (req.session.currentUser) {
    res.json('places/new')
  } else {
    res.status(404).json({
      error: 'not-found',
    })
  }
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


module.exports = router
