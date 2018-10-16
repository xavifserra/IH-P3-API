const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const { isLoggedIn } = require('../helpers/is-logged');

router.get('/me', (req, res, next) => {
   console.log('me', req.session.currentUser);
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else {
    res.status(404).json({
      error: 'not-found'
    });
  }
});

router.post('/login', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({
      error: 'unauthorized'
    });
  }

  const {
    username,
    password
  } = req.body;

  if (!username || !password) {
    return res.status(422).json({
      error: 'validation'
    });
  }

  User.findOne({
      username
    })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          error: 'not-found'
        });
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.json(user);
      }
      return res.status(404).json({
        error: 'not-found'
      });
    })
    .catch(next);
});


router.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    email
  } = req.body;
  if (!username || !password) {
    return res.status(422).res.json({
      error: 'empty'
    });
  }

  User.findOne({
      username
    }, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({
          error: 'username-not-unique'
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      console.log('userNotExist');
      User.create({
        username,
        password: hashPass,
        email,
      }).then((newUser) => {
        console.log(newUser);
        req.session.currentUser = newUser;
        res.json(newUser);
      }).catch(next);
    })
    .catch(next);
});

router.post('/logout', (req, res) => {
  req.session.currentUser = null;
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message'
  });
});

module.exports = router;
