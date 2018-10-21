const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()

const User = require('../../models/user')
const Place = require('../../models/place')
const Comment = require('../../models/comment')

const { isLoggedIn } = require('../../helpers/is-logged')

router.get('/', isLoggedIn(), (req, res, next) => {
  const { _id: id } = req.session.currentUser

  User.findById(id)
    .then(result => res.status(200).json(result))
    .catch(e => res.status(404).json('not found'))
})

router.put('/', isLoggedIn(), (req, res, next) => {
  const { _id : id } = req.session.currentUser
  const {
    username, password, email, name, lastname,
  } = req.body

  User.findById(id)
    .then((result) => {
      result.username = username
      result.password = password
      result.email = email
      result.name = name
      result.lastname = lastname
      return result.save()
    })
    .then((newUser) => {
      console.log(newUser)
      req.session.currentUser = newUser
      res.status(200).json(newUser)
    })
    .catch(e => res.status(404).json({ error:'not found' }))
})

router.post('/favorite', isLoggedIn(), (req, res, next) => {
  const { _id: id } = req.session.currentUser
  const { placeId } = req.body

  User.findByIdAndUpdate(id, { favorite:{ $push:{ placeId } } }, { new: true })
  return res.status(200).json({
    message: 'put favorite',
  })

  // - body:
  // - validation
  //   - id not valid (404)
  //   - id exists (404)
  // - add to favorites if not there yet
  // - updates user in session
})

router.delete('/favorite/:placeId', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'put favorite/:placeId',
  })
  // - validation
  //   - id is valid (404)
  //   - id not exists (404)
  // - body: (empty - the user is already stored in the session)
  // - remove from favorites
  // - updates user in session
})

router.post('/comment/:placeId', isLoggedIn(), (req, res, next) => {
  const { id } = req.params
  res.status(200).json({
    message: `delete comment/${id}`,
    // - validation
    //  - id is valid (404)
    //  - id not exists (404)
    //  - body: (empty - the user is already stored in the session)
  })
}).delete('/comment/:placeId/:commentId', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: `delete /me/comment//${id}`,

  })
})


module.exports = router
