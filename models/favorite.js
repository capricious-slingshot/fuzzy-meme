const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Favorite = mongoose.model('Favorite', favoriteSchema)

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.types.ObjectId,
    ref: "User"
  },
  campsites: [{
    type: mongoose.Schema.types.ObjectId,
    ref: "Campsite"
  }]
}, {
  timestamps: true
})

module.exports = Favorite