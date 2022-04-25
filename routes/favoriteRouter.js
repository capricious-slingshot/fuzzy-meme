const express = require('express')
const cors = require('./cors')
const authenticate = require('../authenticate')
const favoriteRouter = express.Router()
const Favorite = require('../models/favorite')


favoriteRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
    .then(fav => {
      res.statusCode = 200
       res.setHeader('Content-Type', 'application/json')
      res.json(fav)
    })
    .catch(err => next(err))
  })
  
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(fav => {
      if (fav) {
        req.body.forEach(f => (!fav.campsites.includes(f._id)) ? fav.campsites.push(f._id) : null)
        fav.save()
        .then(fav => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(fav)
        })
        .catch(err => next(err))
      } else {
        Favorite.create({ user: req.user._id })
        .then(fav => {
          req.body.forEach(f => (!fav.campsites.includes(f._id)) ? fav.campsites.push(f._id) : null)
          fav.save()
          .then(fav => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(fav)
            .catch(err => next(err))
          })
          .catch(err => next(err))
        })
        .catch(err => next(err))
      }
    })
    .catch(err => next(err))
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operaton not suppported on /favorites')
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
    .then(favorite => {
      res.statusCode = 200
      if (favorite) {
        res.setHeader('Content-Type', 'application/json')
        res.json(favorite)
      } else {
        res.setHeader('Content-Type', 'text/plain')
        res.end('You do not have any favorites to delete')
      }
    })
    .catch(err => next(err))
  })

favoriteRouter.route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { 
    Favorite.findOne({ user: req.user._id })
    .then( fav => {
      if (fav) {
        if (!fav.campsites.includes(req.params.campsiteId)) {
          fav.campsites.push(req.params.campsiteId)
          fav.save
          .then(f => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(f)
          })
          .catch( err => next(err) )
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('That campsite is already a favorite!') 
        }
      } else {
        Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
        .then(f => {
          res.statusCode = 200
           res.setHeader('Content-Type', 'application/json')
           res.json(f)
        })
        .catch(err => next(err))
      }
    })
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { 
    Favorite.findOne({ user: req.user._id })
    then(favorite => {
      if (favorite) {
        const index = favorite.campsites.indexOf(req.params.campsiteId)
        if (index >= 0){ favorite.campsites.splice(index, 1) }
        favorite.save()
        .then(f => {
          console.log('Favorite Campsite Deleted!', f)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(f)
        })
        .catch(err => next(err))
      } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain')
        res.end('You do not have and favorites to delete!')
      }
    })
    .catch(err => next(err))
  })

  module.exports = favoritesRouter