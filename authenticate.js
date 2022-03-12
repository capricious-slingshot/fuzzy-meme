const passport = require('passport')

//passport plugin
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
//serializes user input to be checked aginst the DB
passport.serializeUser(User.serializeUser())

//QUESTION: if salted and hashed, how is this deserialized exactly?
//after succussful authentication, deserialized before attaching User to req obj
passport.deserializeUser(User.deserializeUser())