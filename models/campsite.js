const mongoose = require('mongoose')
const Schema = mongoose.Schema

// new schema params: (dataHash, configOptions)

const commentSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const campsiteSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  //sub document: Value is an array that can hold multiple documents stored within an array
  comments: [commentSchema]
}, {
  timestamps: true
})

//mongoose automagically looks for the lowercase plural version of the colection
// params: (CollectionName, schemaName)
const Campsite = mongoose.model('Campsite', campsiteSchema)

module.exports = Campsite