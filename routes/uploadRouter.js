const express = require('express')
const authenticate = require('../authenticate')
const multer = require('multer')
const uploadRouter = express.Router()
const cors = require('./cors')


//CUSTOM CONFIGURATION

//STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //error status, path to save file to
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    //error status, sets name of client file to name of file on server
    //if this isn't configured manualy multer will default to random stirng for file name
    cb(null, file.originalname)
  }
})

//IMAGE ONLY FILE TYPE
const imageFileFilter = (req, file, cb) => {
  //checks file extention
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('You can upload only image files!'), false)
  }
  cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter })

uploadRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  //POST is the only allowed path
  //shouldn't the the other requests be simplified into one? splat?

  .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('GET operation not supported on /imageUpload')
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json(req.file)
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /imageUpload')
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('DELETE operation not supported on /imageUpload')
  })

module.exports = uploadRouter