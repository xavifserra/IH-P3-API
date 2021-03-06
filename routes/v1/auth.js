const express = require('express')
// const bcrypt = require('bcrypt')

const router = express.Router()

const User = require('../../models/user')
const { isLoggedIn } = require('../../helpers/is-logged')

router.get('/me', (req, res, next) => {
  console.log('me', req.session.currentUser)

  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser)
  } else {
    res.status(409).json({
      error: 'there is no active session',
    })
  }
})

// eslint-disable-next-line consistent-return
router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'Unautorized.\nSession active, first logout',
    })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(422).json({ error: 'User and password are required' })
  }
  User.findOne({ username })
    .populate('favorites')
    .populate('comments')
    .populate('following')
    .then((user) => {
      console.log(user)
      if (!user) {
        return res.status(404).json({ error: 'user not found' })
      }

      return user.comparePasswords(password)
        .then((value) => {
          console.log(value)
          req.session.currentUser = user
          return res.status(200).json(user)
        })
    })
    .catch(next)
})

// eslint-disable-next-line consistent-return
router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    email,
  } = req.body
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'all fields are required' })
  }
  User.findOne({ email }, 'email')
    .then((match) => {
      if (match) {
        return res.status(400).json({ error: 'email registered' })
      }

      return User.findOne({ username }, 'username')
        .then((userExists) => {
          if (userExists) {
            return res.status(400).json({ error: 'username in use' })
          }
          // const salt = bcrypt.genSaltSync(10)
          // const hashPass = bcrypt.hashSync(password, salt)
          console.log({
            username,
            password, // : hashPass,
            email,
          })
          return User.create({
            username,
            password, // : hashPass,
            email,
          }).then((newUser) => {
            console.log(newUser)
            req.session.currentUser = newUser
            return res.status(200).json(newUser)
          }).catch(next)
        })
    })
    .catch(next)
})

router.post('/logout', (req, res) => {
  req.session.currentUser = null
  res.status(204).json({ error: 'session closed' })
})

module.exports = router
