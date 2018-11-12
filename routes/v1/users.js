const express = require('express')

const router = express.Router()

const User = require('../../models/user')
const Place = require('../../models/place')
const Comment = require('../../models/comment')

const { isLoggedIn } = require('../../helpers/is-logged')

// CRUD
router.get('/', isLoggedIn(), (req, res, next) => {
  const { _id: id } = req.session.currentUser

  User.findById(id)
    .populate('favorites')
    .populate('comments')
    .populate('following')
    .then(user => res.status(200).json(user))
    .catch(e => res.status(404).json('not found'))
}).put('/', isLoggedIn(), (req, res, next) => {
  const { _id : id } = req.session.currentUser
  const {
    username, password, email, name, lastname,
  } = req.body

  User.findById(id)
    .populate('favorites')
    .populate('comments')
    .populate('following')
    .then((result) => {
      // console.log(result)
      result.name = name
      result.lastname = lastname
      result.username = username
      result.password = password
      result.email = email

      return result.save()
    })
    .then((newUser) => {
      console.log(newUser)
      req.session.currentUser = newUser
      res.status(200).json(newUser)
    })
    .catch(e => res.status(404).json({ error:'not found' }))
}).delete('/', isLoggedIn(),  (req, res, next) => {
  const { _id : id } = req.session.currentUser

  return User.findByIdAndDelete(id)
    .then((response) => {
      console.log(response)
      res.status(200).json({ result: 'Ok' })
    })
    .catch(e => res.status(404).json({ error:'not found' }))
})

// FAVORITES
router.get('/favorites', (req, res, next) => { // not Used, returned value in user poulated
  const { _id:id } = req.session.currentUser
  const { placeId } = req.params
  const responseGeoJSON = {
    type:'FeatureCollection',
    features:[],
  }
  // console.log({ id })
  // console.log(placeId)

  User.findById(id)
    .populate('favorites')
    .then((populatedUser) => {
      console.log(populatedUser)
      populatedUser.favorites.forEach((element) => {
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
            services : element.services,
            owner: element.owner,
            comments: element.comments,
          },
          geometry: element.geoLocation,
        })
      })
      res.status(200).json(responseGeoJSON)
    })
    .catch(e => res.status(404).json({ error:'not found' }))
})

router.put('/favorite/:placeId([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { _id:id } = req.session.currentUser
  const { placeId } = req.params

  // console.log({ id })
  // console.log(placeId)

  User.findByIdAndUpdate(id, { $push: { favorites: placeId } }, { new: true })
    .populate('favorites')
    .populate('comments')
    .populate('following')
    .then((updatedUser) => {
      console.log(updatedUser)
      res.status(200).json({ updatedUser })
    })
    .catch(e => res.status(404).json({ error:'not found' }))
}).delete('/favorite/:placeId([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { _id: id } = req.session.currentUser
  const { placeId } = req.params

  User.findByIdAndUpdate(id, { $pull: { favorites:placeId } }, { new: true })
    .populate('favorites')
    .populate('comments')
    .populate('following')
    .then((updatedUser) => {
      console.log(updatedUser)
      res.status(200).json({ updatedUser })
    })
    .catch(e => res.status(404).json({ error:e }))
})

// REVIEWS
router.post('/comment/:placeId([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { _id: postedBy } = req.session.currentUser
  const { placeId: id } = req.params
  const {
    language,
    rating,
    clean,
    smells,
    quiet,
    bright,
    airConditioned,
    suplements,
    fidelityCard,
    ticketRestaurant,
    chequeGourmet,
    wifi,
    movileCoverage,
    details,
  } = req.body

  Comment.create({
    postedBy,
    language,
    details,
    rating,
    clean,
    smells,
    quiet,
    bright,
    airConditioned,
    suplements,
    fidelityCard,
    ticketRestaurant,
    chequeGourmet,
    wifi,
    movileCoverage,
  })
    .then((element) => {
      console.log(id)
      console.log(element._id)
      const comments = element._id

      // TODO update list in USER model
      return Place.findByIdAndUpdate(id, { $push: { comments } }, { new:true }).populate('comments')
    })
    .then(element => res.status(200).json(element))
    .catch(e => res.status(404).json({ error:'not found' }))
}).delete('/comment/:placeId([a-z,0-9]{24})/:commentId([a-z,0-9]{24})', isLoggedIn(), (req, res, next) => {
  const { commentId:id, placeId } = req.params

  Comment.findByIdAndRemove(id)
    .then((element) => {
      console.log(id)
      console.log(element._id)

      return Place.findByIdAndUpdate({ _id:placeId }, { $pull: { comments:id } }, { new:true }).populate('comments')
    })
    .then(element => res.status(200).json(element))
    .catch(e => res.status(404).json({ error:'not found' }))
})


module.exports = router
