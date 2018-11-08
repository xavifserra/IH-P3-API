const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const auth = require('./routes/v1/auth')
const places = require('./routes/v1/places')
const users = require('./routes/v1/users')


result = require('dotenv').config()

if (result.error) {
  throw result.error
}

const app = express()
// db connection

const connectURI = app.get('env') === 'development' ? process.env.MONGO_DEV_URI : process.env.MONGODB_URI
const serverAllowed = app.get('env') === 'development' ? process.env.FRONTEND_DEV : process.env.FRONTEND

mongoose.connect(connectURI, { useNewUrlParser: true })
  .then(open => console.log('Connected to database'))
  .catch(error => console.log(error))

mongoose.set('useCreateIndex', true)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', serverAllowed)
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: process.env.SESSION_SECRET, // poner en el .env
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', auth)
app.use('/api/v1/places', places)
app.use('/api/v1/me', users)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({ error: err.statusMessage })
})

module.exports = app
