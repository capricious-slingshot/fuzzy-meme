const mongoose = require('mongoose')
const Schema = mongoose.Schema

// new schema params: (dataHash, configOptions)

const partnerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

//mongoose automagically looks for the lowercase plural version of the colection
// params: (CollectionName, schemaName)
const Partner = mongoose.model('Partner', partnerSchema)

module.exports = Partner