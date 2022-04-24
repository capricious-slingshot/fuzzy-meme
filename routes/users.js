const express = require('express')
const User = require('../models/user')
const usersRouter = express.Router()
const passport = require('passport')
const authenticate = require('../authenticate')
const cors = require('./cors')

/* GET users listing. */
usersRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
    User.find()
    .then((users) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(users)
    })
    .catch(err => next(err))
  }) 

usersRouter.route('/signup')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .post(cors.corsWithOptions, (req, res) => {
    User.register(
      new User({username: req.body.username}),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({err: err})
        } else {
          //aren't these required fields for registration? if so this should be written differently
          // where does the responsibility lie for form validaion?
          if (req.body.firstname) { user.firstname = req.body.firstname }
          if (req.body.lastname) { user.lastname = req.body.lastname }

          user.save(err => {
            if (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.json({ err: err })
              return
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json({ success: true, status: 'Registration Successful!' })
            })
          })
        }
      }
    )
  })

//multiple kinds of middlewear can be passed to a route after path
//password.authenticate only attaches the user to the request obj and passes on request if valid
usersRouter.route('/login')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({ success: true, token: token, status: 'Login Successful!' })
  })

usersRouter.rouet('/logout')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.corsWithOptions, (req, res, next) => {
    if (req.session) {
      req.session.destroy()
      res.clearCookie('session-id')
      res.redirect('/')
    } else {
      const err = new Error('Please Login')
      err.status = 401
      return next(err)
    }
  })

module.exports = usersRouter