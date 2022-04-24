const express = require('express')
const Campsite = require('../models/campsite')
const authenticate = require('../authenticate')
const campsiteRouter = express.Router()
const cors = require('./cors')

// route methods when abstracted into own file don't need app.verb - just the verb
// route methods also don't need the '/path' as the first argument - just req, res, next/end

// path is defined in the parent file: `app.use('/campsites', campsiteRouter)`
// ONLY corrisponds to the routes directly below it
campsiteRouter.route('/')
  //preflight - sends request with HTTP options method - client waits for server to respond with what kind fo request it will accept
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  //cors.cors is basic default method that accepts all incoming requests without looking at the whitelist
  .get(cors.cors, (req, res, next) => {
    Campsite.find()
      .populate('comments.author')
      .then(campsites => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsites)
      })
    .catch( err => next(err) )
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.create(req.body)
    .then(campsite => {
      console.log('Campsite Created: ', campsite)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(campsite)
    })
    .catch( err => next(err) )
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /campsites')
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.deleteMany()
      .then(response => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
    .catch( err => next(err) )
  })

campsiteRouter.route('/:campsiteId')
  //preflight
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
      if (campsite) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsite)
      }
    })
    .catch(err => next(err))
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`)
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndUpdate(req.params.campsiteId, {
        $set: req.body
    }, { new: true })
    .then(campsite => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(campsite)
    })
    .catch( err => next(err) )
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndDelete(req.params.campsiteId)
    .then(response => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(response)
    })
    .catch( err => next(err) )
  })

campsiteRouter.route('/:campsiteId/comments')
  //preflight
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
      if (campsite) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsite.comments)
      } else {
        err = new Error(`Campsite ${req.params.campsiteId} not found`)
        //why is this not res.statusCode?
        err.status = (404)
        return next(err)
      }
    })
    .catch( err => next(err) )
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
     Campsite.findById(req.params.campsiteId)
    .then(campsite => {
      if (campsite) {
        req.body.author = req.user._id
        campsite.comments.push(req.body)
        campsite.save()
        .then( campsite => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(campsite)
        })
        .catch( error => next(error) )
      } else {
        err = new Error(`Campsite ${req.params.campsiteId} not found`)
        //why is this not res.statusCode?
        err.status = (404)
        return next(err)
      }
    })
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`)
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
      if (campsite) {
        for (let i = (campsite.comments.length-1); i >= 0; i--) {
          campsite.comments.id(campsite.comments[i]._id).remove()
        }
        campsite.save()
        .then( campsite => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(campsite)
        })
        .catch( error => next(error) )
      } else {
        err = new Error(`Campsite ${req.params.campsiteId} not found`)
        //why is this not res.statusCode?
        err.status = (404)
        return next(err)
      }
    })
    .catch( err => next(err) )
  })

campsiteRouter.route('/:campsiteId/comments/:commentId')
  //preflight
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .populate('comments.author')
    .then(campsite => {
      if (campsite && campsite.comments.id(req.params.commentId)) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsite.comments.id(req.params.commentId))
      } else if (!campsite) {
        err = new Error(`Campsite ${req.params.campsiteId} not found`)
        //why is this not res.statusCode?
        err.status = (404)
        return next(err)
      } else {
        err = new Error(`Comment ${req.params.commentId} not found`)
        //why is this not res.statusCode?
        err.status = (404)
        return next(err)
      }
    })
    .catch( err => next(err) )
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`)
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then(campsite => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if ((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            if (req.body.rating) {
              //wtf is this .id(ksgdgas) method?
              campsite.comments.id(req.params.commentId).rating = req.body.rating
            }
            if (req.body.text) {
              campsite.comments.id(req.params.commentId).text = req.body.text
            }
            campsite.save()
              .then(campsite => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(campsite)
              })
              .catch(error => next(error))
          } else {
            err = new Error('You are not authorized to delete this comment!')
            err.status = 403
            return next(err)
          }
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`)
          err.status = (404)
          return next(err)
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`)
          err.status = (404)
          return next(err)
        }
      })
    .catch( err => next(err) )
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
    .then(campsite => {
      if (campsite && campsite.comments.id(req.params.commentId)) {
        if ((campsite.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
          campsite.comments.id(req.params.commentId).remove()
          campsite.save()
            .then(campsite => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(campsite)
            })
            .catch(error => next(error))
        } else {
          err = new Error('You are not authorized to delete this comment!')
          err.status = 403
          return next(err)
        }
      } else if (!campsite) {
        err = new Error(`Campsite ${req.params.campsiteId} not found`)
        err.status = (404)
        return next(err)
      } else {
        err = new Error(`Comment ${req.params.commentId} not found`)
        err.status = (404)
        return next(err)
      }
    })
    .catch( err => next(err) )
  })

module.exports = campsiteRouter