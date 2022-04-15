const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens

const config = require('./config.js')

//passport plugin
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
//serializes user input to be checked aginst the DB
passport.serializeUser(User.serializeUser())

//QUESTION: if salted and hashed, how is this deserialized exactly?
//after succussful authentication, deserialized before attaching User to req obj
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => jwt.sign(user, config.secretKey, { expiresIn: 3600 })

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(
  new JwtStrategy(
    opts,
    (jwt_payload, done) => {
      console.log('JWT payload:', jwt_payload)
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false)
        } else if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    }
  )
)

exports.verifyUser = passport.authenticate('jwt', { session: false })