
// EXPRESS
const express = require('express')
const app = express()


// MIDDLEWEAR - ordering applies to execution sequence
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

  //AUTHENTICATION
  const auth = (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers.authorization
    if (!authHeader) {
      const err = new Error('Authentication Failed')
      // response header to client 'WWW-Authenticate' was requested, and the menthod was 'Basic'
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }

    // parse authHeader  - method, encoded string
    // Buffer - global class via node.js (no need to require) - .from decodes base64
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
    const user = auth[0]
    const pass = auth[1]
    // basic bitch validation
    if (user === 'admin' && pass === 'password') {
      return next() // authorized
    } else {
      const err = new Error('Authentication Failed')
      res.setHeader('WWW-Authenticate', 'Basic')
      err.status = 401
      return next(err)
    }
  }

  app.use(auth)

app.use(express.static(path.join(__dirname, 'public')))



// DATABASE CONNECTION
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/nucampsite'
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
)


// ROUTING MIDDDLE WARE
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const campsiteRouter = require('./routes/campsitesRouter')
const promotionRouter = require('./routes/promotionsRouter')
const partnerRouter = require('./routes/partnersRouter')

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/campsites', campsiteRouter)
app.use('/promotions', promotionRouter)
app.use('/partners', partnerRouter)


// VIEW MIDDLEWEAR
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// ERROR HANDLING
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// set locals, only providing error in development
app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app