const config = require('./config')
// const url = config.mongoUrl


// EXPRESS
const express = require('express')
const app = express()

  // Secure traffic only
  app.all('*', (req, res, next) => {
    if (req.secure) {
      return next()
    } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`)
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
    }
  })

//PASSPORT
const passport = require('passport')

//MIDDLEWEAR - ordering applies to execution sequence
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
//wtf is FileStore? made up madness per usual?
const FileStore = require('session-file-store')(session)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

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

//does this really need to appear in the file before the inner routes? seems very disorganized
app.use(express.static(path.join(__dirname, 'public')))


// DATABASE CONNECTION
const mongoose = require('mongoose')
const url = config.mongoUrl
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
)

// VIEW MIDDLEWEAR
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


// ERROR HANDLING
// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)))

// set locals, only providing error in development
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app