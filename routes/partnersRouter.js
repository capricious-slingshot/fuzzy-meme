const express = require('express')
const partnersRouter = express.Router()

partnersRouter.route('/')

partnersRouter.route('/')

  // catch all for all HTTP verbs for '/partners
  .all((req, res, next) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      //passes control to the next relevant routing method
      next()
  })

  //next possible endpoints - no need for 'next' to be passed
  .get((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end('will send all the partners to you')
  })

  .post((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end(`will add the partner: ${req.body.name} with descripton: ${req.body.description}`)
  })

  .put((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.statusCode = 403
    res.end(`partner: ${req.body.name} description: ${req.body.description}`)
  })

  .delete((req, res) => {
    res.end('Deleting all partners')
  })

partnersRouter.route('/:partnerId')
  .get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`)
  })
  .post((req, res) => {
    res.end(`PUT opperation not supported on '/partners/${req.params.partnerId}`)
  })
  .put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`)
    res.end(`PUT opperation not supported on '/partners/${req.params.partnerId}`)
  })
  .delete((req, res) => {
    res.end(`Deleting partner: ${req.params.partnerId}`)
  })

module.exports = partnersRouter