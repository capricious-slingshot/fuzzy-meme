const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  //we just ripped this out. why is the cirriculum jumping back and forth?
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  }
})

//attaches plugin - plm provides salt/hash of UN & PW as well as auth methods
userSchema.plugin(passportLocalMongoose)

//creates and exports collection in one line - (CollectionName, Schema)
module.exports = mongoose.model('User', userSchema)