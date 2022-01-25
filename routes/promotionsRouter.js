const express = require('express')
const promotionsRouter = express.Router()

promotionsRouter.route('/')

promotionsRouter.route('/')

  // catch all for all HTTP verbs for '/promotions
  .all((req, res, next) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      //passes control to the next relevant routing method
      next()
  })

  //next possible endpoints - no need for 'next' to be passed
  .get((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end('will send all the promotions to you')
  })

  .post((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.end(`will add the promotion: ${req.body.name} with descripton: ${req.body.description}`)
  })

  .put((req, res) => {
    //status code and header are inherited from .all method unless otherwise defined
    res.statusCode = 403
    res.end(`promotion: ${req.body.name} description: ${req.body.description}`)
  })

  .delete((req, res) => {
    res.end('Deleting all promotions')
  })

promotionsRouter.route('/:promotionId')
  .get((req, res) => {
    res.end(`Will send details of the promotion: ${req.params.promotionId} to you`)
  })
  .post((req, res) => {
    res.end(`PUT opperation not supported on '/promotions/${req.params.promotionId}`)
  })
  .put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`)
    res.end(`PUT opperation not supported on '/promotions/${req.params.promotionId}`)
  })
  .delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`)
  })

module.exports = promotionsRouter