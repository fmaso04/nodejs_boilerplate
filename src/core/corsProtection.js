const cors = require('cors')

const corsProtection = cors(function (req, callback) {
    console.log("Controlling cors origin: " + req.header('Origin'))
    callback(null, { origin: true } )
})

module.exports = {corsProtection};
