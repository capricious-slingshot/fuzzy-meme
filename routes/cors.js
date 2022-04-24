const cors = require('cors')

const whitelist = ['http://localhost:3000', 'https://localhost:3443']
const corsOptionsDelegate = (req, callback) => {
  let corsOptions
  console.log(req.header('Origin'))
  //checks whitelist for origin - accepted if found
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true }
  } else {
    corsOptions = { origin: false }
  }
  callback(null, corsOptions)
}

//returns a middleware function configured to set a headder of accesscontrolalloworigin on our response object w/ * as it's value ()allows all origins
exports.cors = cors()
//passes corsOptionsDelegate to cors and returns a middleware function configured to checck whitlist for origin of the incoming request
//if on whitelist returns accesscontrolalloworigin=(whitelisted origin) if not, cors response header is not included
exports.corsWithOptions = cors(corsOptionsDelegate)