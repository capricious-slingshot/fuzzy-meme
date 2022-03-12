const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  admin: {
    type: Boolean,
    default: false
  }
})

//attaches plugin - plm provides salt/hash of UN & PW as well as auth methods
userSchema.plugin(passportLocalMongoose)

//creates and exports collection in one line - (CollectionName, Schema)
module.exports = mongoose.model('User', userSchema)