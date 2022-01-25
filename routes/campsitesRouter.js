const express = require('express')
const campsiteRouter = express.Router()

// route methods when abstracted into own file don't need app.verb - just the verb
// route methods also don't need the '/path' as the first argument - just req, res, next/end

// path is defined in the parent file: `app.use('/campsites', campsiteRouter)`
// ONLY corrisponds to the routes directly below it
campsiteRouter.route('/')

  // catch all for all HTTP verbs for '/campsites
  .all((req, res, next) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      //passes control to the next relevant routing method
      next()
  })

  //next possible endpoints - no need for 'next' to be passed
  .get((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end('will send all the campsites to you')
  })

  .post((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end(`will add the campsite: ${req.body.name} with descripton: ${req.body.description}`)
  })

  .put((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.statusCode = 403
    res.end(`campsite: ${req.body.name} description: ${req.body.description}`)
  })

  .delete((req, res) => {
    res.end('Deleting all campsites')
  })

campsiteRouter.route('/:campsiteId')
  .get((req, res) => {
    res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`)
  })
  .post((req, res) => {
    res.end(`PUT opperation not supported on '/campsites/${req.params.campsiteId}`)
  })
  .put((req, res) => {
    res.write(`Updating the campsite: ${req.params.campsiteId}\n`)
    res.end(`PUT opperation not supported on '/campsites/${req.params.campsiteId}`)
  })
  .delete((req, res) => {
    res.end(`Deleting campsite: ${req.params.campsiteId}`)
  })

module.exports = campsiteRouter